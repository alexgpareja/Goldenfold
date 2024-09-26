using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.DTO;
using HospitalApi.Models;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngresosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public IngresosController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de ingresos basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="idPaciente">El ID del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="idMedico">El ID del médico a buscar. Este parámetro es opcional.</param>
        /// <param name="estado">El estado del ingreso a buscar. Este parámetro es opcional.</param>
        /// <returns>Una lista de objetos <see cref="IngresoDTO"/> que representan los ingresos encontrados.</returns>
        /// <response code="200">Devuelve una lista de ingresos que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran ingresos que coincidan con los criterios proporcionados.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngresoDTO>>> GetIngresos([FromQuery] int? idPaciente, [FromQuery] int? idMedico, [FromQuery] string? estado)
        {
            IQueryable<Ingreso> query = _context.Ingresos;

            // Filtros opcionales
            if (idPaciente.HasValue)
                query = query.Where(i => i.IdPaciente == idPaciente.Value);

            if (idMedico.HasValue)
                query = query.Where(i => i.IdMedico == idMedico.Value);

            if (!string.IsNullOrEmpty(estado))
            {
                if (Enum.TryParse(typeof(EstadoIngreso), estado, true, out var estadoEnum))
                {
                    query = query.Where(i => i.Estado == (EstadoIngreso)estadoEnum);
                }
                else
                {
                    return BadRequest("El valor de estado no es válido.");
                }
            }

            // Ejecutar la consulta
            var ingresos = await query.ToListAsync();

            // Mapeo y devolución de la lista (puede estar vacía)
            var ingresosDTO = _mapper.Map<IEnumerable<IngresoDTO>>(ingresos);
            return Ok(ingresosDTO);  // Devolver una lista vacía si no hay ingresos, en lugar de un 404.
        }


        /// <summary>
        /// Obtiene un ingreso específico por su ID.
        /// </summary>
        /// <param name="id">El ID del ingreso que se desea obtener.</param>
        /// <returns>Un objeto <see cref="IngresoDTO"/> que representa el ingreso solicitado.</returns>
        /// <response code="200">Devuelve el ingreso solicitado.</response>
        /// <response code="404">Si no se encuentra un ingreso con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<IngresoDTO>> GetIngreso(int id)
        {
            var ingreso = await _context.Ingresos.FindAsync(id);

            if (ingreso == null)
            {
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");
            }

            var ingresoDTO = _mapper.Map<IngresoDTO>(ingreso);
            return Ok(ingresoDTO);
        }

        /// <summary>
        /// Crea un nuevo ingreso en la base de datos. 
        /// </summary>
        /// <param name="ingresoDTO">El objeto <see cref="IngresoCreateDTO"/> que contiene los datos del ingreso a crear.</param>
        /// <returns>Un objeto <see cref="IngresoDTO"/> que representa el ingreso recién creado.</returns>
        /// <response code="201">El ingreso ha sido creado exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpPost]
        public async Task<ActionResult<IngresoDTO>> CreateIngreso(IngresoCreateDTO ingresoDTO)
        {
            // Verificar si el paciente y el médico existen
            if (!await _context.Pacientes.AnyAsync(p => p.IdPaciente == ingresoDTO.IdPaciente))
            {
                return BadRequest("El paciente especificado no existe.");
            }

            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == ingresoDTO.IdMedico))
            {
                return BadRequest("El médico especificado no existe.");
            }

            // Mapea desde DTO a modelo de entidad
            var ingreso = _mapper.Map<Ingreso>(ingresoDTO);

            // Guardar el ingreso en la base de datos
            _context.Ingresos.Add(ingreso);
            await _context.SaveChangesAsync();

            // Buscar la consulta relacionada con el paciente
            var consulta = await _context.Consultas
                .Where(c => c.IdPaciente == ingresoDTO.IdPaciente && c.Estado == EstadoConsulta.pendiente)
                .FirstOrDefaultAsync();

            if (consulta == null)
            {
                return NotFound("No se encontró una consulta pendiente para este paciente.");
            }

            // Cambiar el estado de la consulta a "completada" y asignar la fecha de consulta
            consulta.Estado = EstadoConsulta.completada;
            consulta.FechaConsulta = DateTime.Now;

            // Guardar los cambios de la consulta
            _context.Consultas.Update(consulta);
            await _context.SaveChangesAsync();

            // Mapea la entidad de vuelta a DTO para la respuesta
            var ingresoDTOResult = _mapper.Map<IngresoDTO>(ingreso);

            // Devuelve la respuesta
            return CreatedAtAction(nameof(GetIngreso), new { id = ingresoDTOResult.IdIngreso }, ingresoDTOResult);
        }

        /// <summary>
        /// Actualiza un ingreso existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID del ingreso que se va a actualizar.</param>
        /// <param name="ingresoDTO">El objeto <see cref="IngresoUpdateDTO"/> que contiene los datos actualizados del ingreso.</param>
        /// <returns>Un código de estado HTTP que indica el resultado de la operación de actualización.</returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado no coincide con el ID del ingreso.</response>
        /// <response code="404">Si no se encuentra el ingreso con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIngreso(int id, IngresoUpdateDTO ingresoDTO)
        {
            if (id != ingresoDTO.IdIngreso)
            {
                return BadRequest("El ID proporcionado no coincide con el ID del ingreso.");
            }

            var ingresoExiste = await _context.Ingresos.FindAsync(id);

            if (ingresoExiste == null)
            {
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");
            }

            // Guardar el estado anterior para comparar cambios
            var estadoAnterior = ingresoExiste.Estado;

            // Mapear los cambios desde DTO al modelo
            _mapper.Map(ingresoDTO, ingresoExiste);

            // Si el estado ha cambiado de "Pendiente" a "Ingresado", actualizamos la FechaIngreso
            if (estadoAnterior == EstadoIngreso.Pendiente && ingresoDTO.Estado == "Ingresado")
            {
                ingresoExiste.FechaIngreso = DateTime.Now; // Establecer la fecha de ingreso
            }

            // Si el estado es "Rechazado", no es necesario actualizar la FechaIngreso
            // El estado será actualizado desde el DTO
            if (ingresoDTO.Estado == "Rechazado")
            {
                ingresoExiste.FechaIngreso = null; // Si está rechazado, no hay ingreso
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngresoExists(id))
                {
                    return NotFound($"No se encontró ningún ingreso con el ID {id}.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Elimina un ingreso específico de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID del ingreso que se desea eliminar.</param>
        /// <returns>Un código de estado HTTP que indica el resultado de la operación de eliminación.</returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra el ingreso con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngreso(int id)
        {
            // Buscar el ingreso que se va a eliminar
            var ingreso = await _context.Ingresos.FindAsync(id);
            if (ingreso == null)
            {
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");
            }

            // Verificar si el ingreso tiene una asignación relacionada
            if (ingreso.IdAsignacion.HasValue)
            {
                // Buscar la asignación relacionada
                var asignacion = await _context.Asignaciones.FindAsync(ingreso.IdAsignacion.Value);
                if (asignacion != null)
                {
                    // Actualizar el estado de la cama a "Disponible"
                    var cama = await _context.Camas.FindAsync(asignacion.IdCama);
                    if (cama != null)
                    {
                        cama.Estado = EstadoCama.Disponible;
                        _context.Camas.Update(cama); // Actualizar el estado de la cama
                    }

                    // Eliminar la asignación relacionada
                    _context.Asignaciones.Remove(asignacion);
                }
            }

            // Eliminar el ingreso
            _context.Ingresos.Remove(ingreso);

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return NoContent(); // Devolver un código 204 (sin contenido) como respuesta
        }

        private bool IngresoExists(int id)
        {
            return _context.Ingresos.Any(e => e.IdIngreso == id);
        }
    }
}
