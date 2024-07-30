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

        // GET: api/Asignaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDTO>>> GetAsignaciones()
        {
            var asignaciones = await _context.Asignaciones.ToListAsync();
            if (!asignaciones.Any())
            {
                return NotFound("No se han encontrado asignaciones.");
            }
            var asignacionesDTO = _mapper.Map<IEnumerable<AsignacionDTO>>(asignaciones);
            return Ok(asignacionesDTO);
        }

        // GET: api/Asignaciones/{id}
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

        // POST: api/Asignaciones
        [HttpPost]
        public async Task<ActionResult<AsignacionDTO>> CreateAsignacion(AsignacionDTO asignacionDTO)
        {
            var asignacion = _mapper.Map<Asignacion>(asignacionDTO);
            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();
            asignacionDTO.IdAsignacion = asignacion.IdAsignacion;
            return CreatedAtAction(nameof(GetAsignacion), new { id = asignacionDTO.IdAsignacion }, asignacionDTO);
        }

        // PUT: api/Asignaciones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, AsignacionDTO asignacionDTO)
        {
            if (id != asignacionDTO.IdAsignacion)
            {
                return BadRequest("El ID de la asignación proporcionada no coincide con el ID en la solicitud.");
            }
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }
            _mapper.Map(asignacionDTO, asignacion);
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

        // DELETE: api/Asignaciones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se encontró la asignación especificada.");
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
