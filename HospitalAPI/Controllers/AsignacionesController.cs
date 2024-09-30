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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDTO>>> GetAsignaciones(
        [FromQuery] int? id_paciente, 
        [FromQuery] int? id_cama, 
        [FromQuery] DateTime? fecha_asignacion, 
        [FromQuery] DateTime? fecha_liberacion, 
        [FromQuery] int? asignado_por)
        {
            IQueryable<Asignacion> query = _context.Asignaciones;

            if (id_paciente.HasValue) query = query.Where(a => a.IdPaciente == id_paciente);
            if (id_cama.HasValue) query = query.Where(a => a.IdCama == id_cama);
            if (fecha_asignacion.HasValue) query = query.Where(a => a.FechaAsignacion.Date == fecha_asignacion.Value.Date);
            if (fecha_liberacion.HasValue) query = query.Where(a => a.FechaLiberacion.Value.Date == fecha_liberacion.Value.Date);
            if (asignado_por.HasValue) query = query.Where(a => a.AsignadoPor == asignado_por);

            var asignaciones = await query.ToListAsync();

            var asignacionesDTO = _mapper.Map<IEnumerable<AsignacionDTO>>(asignaciones);
            return Ok(asignacionesDTO);
        }

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
        
        [HttpPost]
        public async Task<ActionResult<AsignacionDTO>> CreateAsignacion(AsignacionCreateDTO asignacionDTO)
        {

            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado no existe. Por favor, selecciona un usuario válido para la asignación.");
            }

            if (!await _context.Camas.AnyAsync(c => c.IdCama == asignacionDTO.IdCama))
            {
                return BadRequest("La cama especificada no existe.");
            }

            var asignacion = _mapper.Map<Asignacion>(asignacionDTO);
            var cama = await _context.Camas.FindAsync(asignacion.IdCama);
            cama.Estado = EstadoCama.NoDisponible;
            _context.Camas.Update(cama);
            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();

            var ingreso = await _context.Ingresos
                .FirstOrDefaultAsync(i => i.IdPaciente == asignacion.IdPaciente && i.Estado == EstadoIngreso.Pendiente);
            if (ingreso != null)
            {
                ingreso.Estado = EstadoIngreso.Ingresado;
                ingreso.IdAsignacion = asignacion.IdAsignacion;
                ingreso.FechaIngreso = DateTime.Now;
                _context.Ingresos.Update(ingreso);
            }
            await _context.SaveChangesAsync();

            var asignacionDTOResult = _mapper.Map<AsignacionDTO>(asignacion);
            return CreatedAtAction(nameof(GetAsignacion), new { id = asignacionDTOResult.IdAsignacion }, asignacionDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, AsignacionUpdateDTO asignacionDTO)
        {
            var asignacionExiste = await _context.Asignaciones.FindAsync(id);
            if (asignacionExiste == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }

            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado para esta asignación no existe.");
            }

            if (!await _context.Camas.AnyAsync(c => c.IdCama == asignacionDTO.IdCama))
            {
                return BadRequest("La cama especificada no existe.");
            }
            _mapper.Map(asignacionDTO, asignacionExiste);

            if (asignacionDTO.FechaLiberacion.HasValue)
            {
                var cama = await _context.Camas.FindAsync(asignacionDTO.IdCama);
                if (cama != null)
                {
                    cama.Estado = EstadoCama.Disponible;
                    _context.Camas.Update(cama);
                }
                var paciente = await _context.Pacientes.FindAsync(asignacionExiste.IdPaciente);
                if (paciente != null)
                {
                    paciente.Estado = EstadoPaciente.Alta;
                    _context.Pacientes.Update(paciente);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se encontró la asignación especificada.");
            }

            var cama = await _context.Camas.FindAsync(asignacion.IdCama);
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
