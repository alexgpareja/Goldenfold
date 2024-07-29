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

        // GET: api/HistorialAltas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialAltaDTO>>> GetHistorialAltas()
        {
            var historialAltas = await _context.HistorialesAltas.ToListAsync();
            if (!historialAltas.Any())
            {
                return NotFound("No se han encontrado altas.");
            }
            var historialAltasDTO = _mapper.Map<IEnumerable<HistorialAltaDTO>>(historialAltas);
            return Ok(historialAltasDTO);
        }

        // GET: api/HistorialAltas/{id}
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

        // POST: api/HistorialAltas
        [HttpPost]
        public async Task<ActionResult<HistorialAltaDTO>> CreateHistorialAlta(HistorialAltaDTO historialAltaDTO)
        {
            var historialAlta = _mapper.Map<HistorialAlta>(historialAltaDTO);
            _context.HistorialesAltas.Add(historialAlta);
            await _context.SaveChangesAsync();
            historialAltaDTO.IdHistorial = historialAlta.IdHistorial;
            return CreatedAtAction(nameof(GetHistorialAltaById), new { id = historialAltaDTO.IdHistorial }, historialAltaDTO);
        }

        // PUT: api/HistorialAltas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHistorialAlta(int id, HistorialAltaDTO historialAltaDTO)
        {
            if (id != historialAltaDTO.IdHistorial)
            {
                return BadRequest("El ID del historial proporcionado no coincide con el ID en la solicitud.");
            }

            var historialAlta = await _context.HistorialesAltas.FindAsync(id);
            if (historialAlta == null)
            {
                return NotFound("No se encontró el historial especificado.");
            }

            _mapper.Map(historialAltaDTO, historialAlta);

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


        // DELETE: api/HistorialAltas/{id}
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
