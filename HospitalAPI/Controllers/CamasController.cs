using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CamasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public CamasController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        // GET: api/Camas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CamaDTO>>> GetCamas()
        {
            var camas = await _context.Camas.ToListAsync();
            if (!camas.Any())
            {
                return NotFound("No se han encontrado camas.");
            }
            var camasDTO = _mapper.Map<IEnumerable<CamaDTO>>(camas);
            return Ok(camasDTO);
        }


        // GET: api/Camas/{ubicacion}
        [HttpGet("{ubicacion}")]
        public async Task<ActionResult<CamaDTO>> GetCamaByUbicacion(string ubicacion)
        {
            var cama = await _context.Camas.FindAsync(ubicacion);
            if (cama == null)
            {
                return NotFound("No se ha encontrado ninguna cama con esta ubicación.");
            }
            var camaDTO = _mapper.Map<CamaDTO>(cama);
            return Ok(camaDTO);
        }


        // POST: api/Camas
        [HttpPost]
        public async Task<ActionResult<CamaDTO>> CreateCama(CamaDTO camaDTO)
        {
            if (await _context.Camas.AnyAsync(c => c.Ubicacion == camaDTO.Ubicacion))
            {
                return Conflict("La ubicación de la cama ya está en uso.");
            }
            var cama = _mapper.Map<Cama>(camaDTO);
            _context.Camas.Add(cama);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCamaByUbicacion), new { ubicacion = cama.Ubicacion }, camaDTO);
        }


        // PUT: api/Camas/{ubicacion}
        [HttpPut("{ubicacion}")]
        public async Task<IActionResult> UpdateCama(string ubicacion, CamaDTO camaDTO)
        {
            if (ubicacion != camaDTO.Ubicacion)
            {
                return BadRequest("La ubicación de la cama proporcionada no coincide con la ubicación en la solicitud.");
            }
            var camaExistente = await _context.Camas.FindAsync(ubicacion);
            if (camaExistente == null)
            {
                return NotFound("No se encontró la cama especificada.");
            }
            _mapper.Map(camaDTO, camaExistente);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CamaExists(ubicacion))
                {
                    return NotFound("No se encontró la cama especificada.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        // DELETE: api/Camas/{ubicacion}
        [HttpDelete("{ubicacion}")]
        public async Task<IActionResult> DeleteCama(string ubicacion)
        {
            var cama = await _context.Camas.FindAsync(ubicacion);
            if (cama == null)
            {
                return NotFound("No se encontró la cama especificada.");
            }
            _context.Camas.Remove(cama);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        private bool CamaExists(string ubicacion)
        {
            return _context.Camas.Any(e => e.Ubicacion == ubicacion);
        }
    }
}
