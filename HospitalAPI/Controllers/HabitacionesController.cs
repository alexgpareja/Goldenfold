using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HabitacionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public HabitacionesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Habitaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitacionDTO>>> GetHabitaciones()
        {
            var habitaciones = await _context.Habitaciones.ToListAsync();
            if (!habitaciones.Any())
            {
                return NotFound("No se han encontrado habitaciones.");
            }
            var habitacionesDTO = _mapper.Map<IEnumerable<HabitacionDTO>>(habitaciones);
            return Ok(habitacionesDTO);
        }

        // GET: api/Habitaciones/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HabitacionDTO>> GetHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }
            var habitacionDTO = _mapper.Map<HabitacionDTO>(habitacion);
            return Ok(habitacionDTO);
        }

        // POST: api/Habitaciones
        [HttpPost]
        public async Task<ActionResult<HabitacionDTO>> CreateHabitacion(HabitacionDTO habitacionDTO)
        {
            if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion))
            {
                return Conflict("Ya existe una habitación con el número proporcionado.");
            }

            var habitacion = _mapper.Map<Habitacion>(habitacionDTO);

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            habitacionDTO.IdHabitacion = habitacion.IdHabitacion;
            return CreatedAtAction(nameof(GetHabitacion), new { id = habitacionDTO.IdHabitacion }, habitacionDTO);
        }

        // PUT: api/Habitaciones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabitacion(int id, HabitacionDTO habitacionDTO)
        {
            if (id != habitacionDTO.IdHabitacion)
            {
                return BadRequest("El ID de la habitación proporcionada no coincide con el ID en la solicitud.");
            }

            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            _mapper.Map(habitacionDTO, habitacion);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitacionExists(id))
                {
                    return NotFound("No se ha encontrado la habitación especificada.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Habitaciones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            _context.Habitaciones.Remove(habitacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HabitacionExists(int id)
        {
            return _context.Habitaciones.Any(e => e.IdHabitacion == id);
        }
    }
}
