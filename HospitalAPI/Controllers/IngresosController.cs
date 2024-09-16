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

            if (idPaciente.HasValue)
                query = query.Where(i => i.IdPaciente == idPaciente.Value);

            if (idMedico.HasValue)
                query = query.Where(i => i.IdMedico == idMedico.Value);

            // Si estado es un enum, manejar la conversión correctamente
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

            var ingresos = await query.ToListAsync();

            if (!ingresos.Any())
            {
                return NotFound("No se encontraron ingresos con los criterios de búsqueda proporcionados.");
            }

            var ingresosDTO = _mapper.Map<IEnumerable<IngresoDTO>>(ingresos);
            return Ok(ingresosDTO);
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
        public async Task<ActionResult<IngresoDTO>> GetIngresoById(int id)
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
            if (!await _context.Pacientes.AnyAsync(p => p.IdPaciente == ingresoDTO.IdPaciente))
            {
                return BadRequest("El paciente especificado no existe.");
            }

            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == ingresoDTO.IdMedico))
            {
                return BadRequest("El médico especificado no existe.");
            }

            var ingreso = _mapper.Map<Ingreso>(ingresoDTO);
            _context.Ingresos.Add(ingreso);
            await _context.SaveChangesAsync();

            var ingresoDTOResult = _mapper.Map<IngresoDTO>(ingreso);
            return CreatedAtAction(nameof(GetIngresoById), new { id = ingresoDTOResult.IdIngreso }, ingresoDTOResult);
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

            _mapper.Map(ingresoDTO, ingresoExiste);

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
            var ingreso = await _context.Ingresos.FindAsync(id);

            if (ingreso == null)
            {
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");
            }

            _context.Ingresos.Remove(ingreso);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IngresoExists(int id)
        {
            return _context.Ingresos.Any(e => e.IdIngreso == id);
        }
    }
}
