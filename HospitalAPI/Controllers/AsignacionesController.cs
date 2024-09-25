using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsignacionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AsignacionesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de asignaciones basada en los parámetros de búsqueda opcionales.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDTO>>> GetAsignaciones([FromQuery] int? id_paciente, [FromQuery] int? id_cama, [FromQuery] DateTime? fecha_asignacion, [FromQuery] DateTime? fecha_liberacion, [FromQuery] int? asignado_por)
        {
            IQueryable<Asignacion> query = _context.Asignaciones;

            if (id_paciente.HasValue) query = query.Where(a => a.IdPaciente == id_paciente);
            if (id_cama.HasValue) query = query.Where(a => a.IdCama == id_cama); // Cambiado a IdCama
            if (fecha_asignacion.HasValue) query = query.Where(a => a.FechaAsignacion.Date == fecha_asignacion.Value.Date);
            if (fecha_liberacion.HasValue) query = query.Where(a => a.FechaLiberacion.Value.Date == fecha_liberacion.Value.Date);
            if (asignado_por.HasValue) query = query.Where(a => a.AsignadoPor == asignado_por);

            var asignaciones = await query.ToListAsync();

            var asignacionesDTO = _mapper.Map<IEnumerable<AsignacionDTO>>(asignaciones);
            return Ok(asignacionesDTO);
        }

        /// <summary>
        /// Obtiene una asignación específica por su ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AsignacionDTO>> GetAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }
            var asignacionDTO = _mapper.Map<AsignacionDTO>(asignacion);
            return Ok(asignacionDTO);
        }

        /// <summary>
        /// Crea una nueva asignación en la base de datos.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AsignacionDTO>> CreateAsignacion(AsignacionCreateDTO asignacionDTO)
        {
            // Validar si el usuario existe
            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado no existe. Por favor, selecciona un usuario válido para la asignación.");
            }

            // Validar si la cama existe
            if (!await _context.Camas.AnyAsync(c => c.IdCama == asignacionDTO.IdCama))
            {
                return BadRequest("La cama especificada no existe.");
            }

            // Crear la asignación
            var asignacion = _mapper.Map<Asignacion>(asignacionDTO);

            // Actualizar el estado de la cama a "NoDisponible"
            var cama = await _context.Camas.FindAsync(asignacion.IdCama);
            cama.Estado = EstadoCama.NoDisponible;
            _context.Camas.Update(cama);

            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();

            // Actualizar el estado del paciente a "Ingresado"
            var paciente = await _context.Pacientes.FindAsync(asignacionDTO.IdPaciente);
            if (paciente != null)
            {
                paciente.Estado = EstadoPaciente.Ingresado;  // Asegúrate de que el campo 'Estado' del paciente sea un enum compatible
                _context.Pacientes.Update(paciente);
            }

            // Actualizar el estado del ingreso a "Asignado" y asignar el IdAsignacion
            var ingreso = await _context.Ingresos
                .FirstOrDefaultAsync(i => i.IdPaciente == asignacion.IdPaciente && i.Estado == EstadoIngreso.Pendiente); // Comparar con el enum
            if (ingreso != null)
            {
                ingreso.Estado = EstadoIngreso.Ingresado;
                ingreso.IdAsignacion = asignacion.IdAsignacion;
                _context.Ingresos.Update(ingreso);
            }

            // Guardar los cambios
            await _context.SaveChangesAsync();

            // Devolver el resultado
            var asignacionDTOResult = _mapper.Map<AsignacionDTO>(asignacion);
            return CreatedAtAction(nameof(GetAsignacion), new { id = asignacionDTOResult.IdAsignacion }, asignacionDTOResult);
        }



        /// <summary>
        /// Actualiza una asignación existente en la base de datos.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, AsignacionUpdateDTO asignacionDTO)
        {
            var asignacionExiste = await _context.Asignaciones.FindAsync(id);
            if (asignacionExiste == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }

            // Verificar si el usuario asignado existe
            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado para esta asignación no existe.");
            }

            // Verificar si la cama asignada existe
            if (!await _context.Camas.AnyAsync(c => c.IdCama == asignacionDTO.IdCama))
            {
                return BadRequest("La cama especificada no existe.");
            }

            // Mapear los datos del DTO a la asignación existente
            _mapper.Map(asignacionDTO, asignacionExiste);

            // Si se añade una fecha de liberación, cambiar el estado de la cama a "Disponible" y el paciente a "Alta"
            if (asignacionDTO.FechaLiberacion.HasValue)
            {
                // Liberar la cama
                var cama = await _context.Camas.FindAsync(asignacionDTO.IdCama);
                if (cama != null)
                {
                    cama.Estado = EstadoCama.Disponible; // Cambiar estado de la cama
                    _context.Camas.Update(cama);
                }

                // Cambiar el estado del paciente a "Alta"
                var paciente = await _context.Pacientes.FindAsync(asignacionExiste.IdPaciente);
                if (paciente != null)
                {
                    paciente.Estado = EstadoPaciente.Alta; // Cambiar estado del paciente
                    _context.Pacientes.Update(paciente);
                }
            }

            try
            {
                await _context.SaveChangesAsync(); // Guardar los cambios
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AsignacionExists(id))
                {
                    return NotFound("No se encontró la asignación especificada.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        /// <summary>
        /// Elimina una asignación específica de la base de datos por su ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se encontró la asignación especificada.");
            }

            var cama = await _context.Camas.FindAsync(asignacion.IdCama); // Cambiado a IdCama
            if (cama != null)
            {
                cama.Estado = EstadoCama.Disponible;
                _context.Camas.Update(cama);
            }

            _context.Asignaciones.Remove(asignacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AsignacionExists(int id)
        {
            return _context.Asignaciones.Any(e => e.IdAsignacion == id);
        }
    }
}
