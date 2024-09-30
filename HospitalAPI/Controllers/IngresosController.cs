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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngresoDTO>>> GetIngresos(
            [FromQuery] int? idPaciente,
            [FromQuery] int? idMedico,
            [FromQuery] string? estado,
            [FromQuery] string? tipoCama,
            [FromQuery] DateTime? fechaSolicitudDesde,
            [FromQuery] DateTime? fechaSolicitudHasta)
        {
            IQueryable<Ingreso> query = _context.Ingresos;

            if (idPaciente.HasValue)
                query = query.Where(i => i.IdPaciente == idPaciente.Value);

            if (idMedico.HasValue)
                query = query.Where(i => i.IdMedico == idMedico.Value);

            if (!string.IsNullOrEmpty(estado) && Enum.TryParse(typeof(EstadoIngreso), estado, true, out var estadoEnum))
                query = query.Where(i => i.Estado == (EstadoIngreso)estadoEnum);

            if (!string.IsNullOrEmpty(tipoCama) && Enum.TryParse(typeof(TipoCama), tipoCama, true, out var tipoCamaEnum))
                query = query.Where(i => i.TipoCama == (TipoCama)tipoCamaEnum);

            if (fechaSolicitudDesde.HasValue)
                query = query.Where(i => i.FechaSolicitud >= fechaSolicitudDesde.Value);

            if (fechaSolicitudHasta.HasValue)
                query = query.Where(i => i.FechaSolicitud <= fechaSolicitudHasta.Value);

            var ingresos = await query.ToListAsync();
            var ingresosDTO = _mapper.Map<IEnumerable<IngresoDTO>>(ingresos);

            return Ok(ingresosDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IngresoDTO>> GetIngreso(int id)
        {
            var ingreso = await _context.Ingresos.FirstOrDefaultAsync(i => i.IdIngreso == id);

            if (ingreso == null)
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");

            var ingresoDTO = _mapper.Map<IngresoDTO>(ingreso);
            return Ok(ingresoDTO);
        }

        [HttpPost]
        public async Task<ActionResult<IngresoDTO>> CreateIngreso(IngresoCreateDTO ingresoDTO)
        {
            if (!await _context.Pacientes.AnyAsync(p => p.IdPaciente == ingresoDTO.IdPaciente))
                return BadRequest("El paciente especificado no existe.");

            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == ingresoDTO.IdMedico))
                return BadRequest("El médico especificado no existe.");

            if (!Enum.IsDefined(typeof(TipoCama), ingresoDTO.TipoCama))
                return BadRequest("El tipo de cama proporcionado no es válido.");

            var ingreso = _mapper.Map<Ingreso>(ingresoDTO);
            _context.Ingresos.Add(ingreso);
            await _context.SaveChangesAsync();

            var consulta = await _context.Consultas
                .Where(c => c.IdPaciente == ingresoDTO.IdPaciente && c.Estado == EstadoConsulta.pendiente)
                .FirstOrDefaultAsync();

            if (consulta != null)
            {
                consulta.Estado = EstadoConsulta.completada;
                consulta.FechaConsulta = DateTime.Now;
                _context.Consultas.Update(consulta);
                await _context.SaveChangesAsync();
            }

            var ingresoDTOResult = _mapper.Map<IngresoDTO>(ingreso);
            return CreatedAtAction(nameof(GetIngreso), new { id = ingresoDTOResult.IdIngreso }, ingresoDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIngreso(int id, IngresoUpdateDTO ingresoDTO)
        {
            if (id != ingresoDTO.IdIngreso)
                return BadRequest("El ID proporcionado no coincide con el ID del ingreso.");

            var ingresoExiste = await _context.Ingresos.FindAsync(id);
            if (ingresoExiste == null)
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");

            if (!Enum.IsDefined(typeof(TipoCama), ingresoDTO.TipoCama))
                return BadRequest("El tipo de cama proporcionado no es válido.");

            if (!Enum.TryParse(ingresoDTO.Estado, out EstadoIngreso nuevoEstado))
                return BadRequest("El estado proporcionado no es válido.");

            // Verificar si la cama está ocupada por otra asignación activa
            var camaAsignada = await _context.Asignaciones
                .Where(a => a.IdCama == ingresoDTO.IdAsignacion && a.FechaLiberacion == null && a.IdPaciente != ingresoDTO.IdPaciente)
                .FirstOrDefaultAsync();

            if (camaAsignada != null)
            {
                return BadRequest("La cama está ocupada por otro paciente.");
            }

            // Mapear los cambios desde el DTO a la entidad de ingreso
            _mapper.Map(ingresoDTO, ingresoExiste);
            ingresoExiste.Estado = nuevoEstado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!IngresoExists(id))
                    return NotFound($"No se encontró ningún ingreso con el ID {id}.");
                else
                    throw;
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngreso(int id)
        {
            var ingreso = await _context.Ingresos.FindAsync(id);
            if (ingreso == null)
                return NotFound($"No se encontró ningún ingreso con el ID {id}.");

            // Si el ingreso tiene una asignación relacionada
            if (ingreso.IdAsignacion.HasValue)
            {
                // Buscar la asignación relacionada
                var asignacion = await _context.Asignaciones.FindAsync(ingreso.IdAsignacion.Value);
                if (asignacion != null)
                {
                    // Eliminar la asignación relacionada
                    _context.Asignaciones.Remove(asignacion);
                }
            }

            // Eliminar el ingreso
            _context.Ingresos.Remove(ingreso);

            // Guardar los cambios en la base de datos
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool IngresoExists(int id)
        {
            return _context.Ingresos.Any(e => e.IdIngreso == id);
        }
    }
}
