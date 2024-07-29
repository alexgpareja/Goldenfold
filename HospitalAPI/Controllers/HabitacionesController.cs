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
            var habitacionesDTO = _mapper.Map<IEnumerable<HabitacionDTO>>(habitaciones);
            return Ok(habitacionesDTO);
        }

        // GET: api/Habitaciones/{NumHabitacion}
        [HttpGet("{NumHabitacion}")]
        public async Task<ActionResult<HabitacionDTO>> GetHabitacion(string NumHabitacion)
        {
            // Convertir NumHabitacion de string a int
            if (!int.TryParse(NumHabitacion, out int numHabitacionInt))
            {
                return BadRequest("El número de habitación debe ser un valor numérico.");
            }

            // Buscar la habitación por número de habitación convertido a int
            var habitacion = await _context.Habitaciones
                .FirstOrDefaultAsync(h => int.Parse(h.NumeroHabitacion) == numHabitacionInt);

            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el número proporcionado.");
            }

            var habitacionDTO = _mapper.Map<HabitacionDTO>(habitacion);
            return Ok(habitacionDTO);
        }

        // POST: api/Habitaciones
        [HttpPost]
        public async Task<ActionResult<HabitacionDTO>> CreateHabitacion(HabitacionDTO habitacionDTO)
        {
            // Verificar si ya existe una habitación con el mismo número de habitación
            if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion))
            {
                return Conflict("Ya existe una habitación con el número proporcionado.");
            }

            var habitacion = _mapper.Map<Habitacion>(habitacionDTO);

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            habitacionDTO.IdHabitacion = habitacion.IdHabitacion;
            return CreatedAtAction("GetHabitacionByNum", new { NumHabitacion = habitacionDTO.NumeroHabitacion }, habitacionDTO);
        }

        // PUT: api/Habitaciones/{NumHabitacion}
        [HttpPut("{NumHabitacion}")]
        public async Task<IActionResult> EditHabitacionByNum(string NumHabitacion, HabitacionDTO habitacionDTO)
        {
            // Buscar la habitación actual por su número
            var habitacionExistente = await _context.Habitaciones
                .FirstOrDefaultAsync(h => h.NumeroHabitacion == NumHabitacion);

            if (habitacionExistente == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el número proporcionado.");
            }

            // Validar que el nuevo número de habitación no esté en uso
            if (habitacionDTO.NumeroHabitacion != NumHabitacion)
            {
                if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion))
                {
                    return Conflict("Ya existe una habitación con el nuevo número proporcionado.");
                }
            }

            _mapper.Map(habitacionDTO, habitacionExistente);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HabitacionExists(habitacionExistente.IdHabitacion))
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

        // DELETE: api/Habitaciones/{NumHabitacion}
        [HttpDelete("{NumHabitacion}")]
        public async Task<IActionResult> DeleteHabitacion(string NumHabitacion)
        {
            var habitacion = await _context.Habitaciones
                .FirstOrDefaultAsync(h => h.NumeroHabitacion == NumHabitacion);

            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el número proporcionado.");
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