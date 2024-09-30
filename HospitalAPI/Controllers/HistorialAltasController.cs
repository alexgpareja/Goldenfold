using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistorialAltasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HistorialAltasController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialAltaDTO>>> GetHistorialAltas(
            [FromQuery] int? id_paciente,
            [FromQuery] DateTime? fecha_alta,
            [FromQuery] string? diagnostico,
            [FromQuery] string? tratamiento)
        {
            IQueryable<HistorialAlta> query = _context.HistorialesAltas;

            if (id_paciente.HasValue)
                query = query.Where(h => h.IdPaciente == id_paciente.Value);

            if (fecha_alta.HasValue)
                query = query.Where(h => h.FechaAlta.Date == fecha_alta.Value.Date);

            if (!string.IsNullOrEmpty(diagnostico))
                query = query.Where(h => h.Diagnostico.ToLower().Contains(diagnostico.ToLower()));

            if (!string.IsNullOrEmpty(tratamiento))
                query = query.Where(h => h.Tratamiento.ToLower().Contains(tratamiento.ToLower()));

            var historialAlta = await query.ToListAsync();

            var historialAltasDTO = _mapper.Map<IEnumerable<HistorialAltaDTO>>(historialAlta);

            return Ok(historialAltasDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HistorialAltaDTO>> GetHistorialAltaById(int id)
        {
            var historialAlta = await _context.HistorialesAltas.FindAsync(id);
            if (historialAlta == null)
            {
                return NotFound("No se ha encontrado ninguna alta con este ID.");
            }
            var historialAltaDTO = _mapper.Map<HistorialAltaDTO>(historialAlta);
            return Ok(historialAltaDTO);
        }

        [HttpPost]
        public async Task<ActionResult<HistorialAltaDTO>> CreateHistorialAlta(HistorialAltaCreateDTO historialAltaDTO)
        {
            var paciente = await _context.Pacientes.FindAsync(historialAltaDTO.IdPaciente);
            if (paciente == null)
            {
                return NotFound("El paciente especificado no existe.");
            }

            var medico = await _context.Usuarios.FindAsync(historialAltaDTO.IdMedico);
            if (medico == null)
            {
                return NotFound("El médico especificado no existe.");
            }

            paciente.Estado = EstadoPaciente.Alta;

            var consulta = await _context.Consultas
    .Where(c => c.IdPaciente == historialAltaDTO.IdPaciente)
    .FirstOrDefaultAsync();


            if (consulta == null)
            {
                return NotFound("No se encontró una consulta pendiente para este paciente.");
            }

            consulta.Estado = EstadoConsulta.completada;
            consulta.FechaConsulta = DateTime.Now;

            var historialAlta = _mapper.Map<HistorialAlta>(historialAltaDTO);

            _context.HistorialesAltas.Add(historialAlta);

            await _context.SaveChangesAsync();

            var historialAltaDTOResult = _mapper.Map<HistorialAltaDTO>(historialAlta);

            return CreatedAtAction(nameof(GetHistorialAltas), new { id = historialAltaDTOResult.IdHistorial }, historialAltaDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHistorialAlta(int id, HistorialAltaUpdateDTO historialAltaDTO)
        {
            var historialAltaExiste = await _context.HistorialesAltas.FindAsync(id);

            if (historialAltaExiste == null)
            {
                return NotFound("No se encontró el historial especificado.");
            }
            _mapper.Map(historialAltaDTO, historialAltaExiste);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistorialAltaExists(id))
                {
                    return NotFound("No se encontró el historial especificado.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistorialAlta(int id)
        {
            var historialAlta = await _context.HistorialesAltas.FindAsync(id);

            if (historialAlta == null)
            {
                return NotFound("No se encontró el historial especificado.");
            }
            _context.HistorialesAltas.Remove(historialAlta);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool HistorialAltaExists(int id)
        {
            return _context.HistorialesAltas.Any(e => e.IdHistorial == id);
        }
    }
}
