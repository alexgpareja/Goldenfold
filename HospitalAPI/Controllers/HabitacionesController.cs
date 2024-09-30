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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitacionDTO>>> GetHabitaciones(
            [FromQuery] string? edificio,
            [FromQuery] string? planta,
            [FromQuery] string? numeroHabitacion)
        {
            IQueryable<Habitacion> query = _context.Habitaciones;

            if (!string.IsNullOrEmpty(edificio))
                query = query.Where(h => h.Edificio.Contains(edificio.ToLower()));

            if (!string.IsNullOrEmpty(planta))
                query = query.Where(h => h.Planta.Contains(planta.ToLower()));

            if (!string.IsNullOrEmpty(numeroHabitacion))
                query = query.Where(h => h.NumeroHabitacion.Contains(numeroHabitacion.ToLower()));

            var habitaciones = await query.ToListAsync();

            if (!habitaciones.Any())
            {
                return NotFound("No se han encontrado habitaciones.");
            }

            var habitacionesDTO = _mapper.Map<IEnumerable<HabitacionDTO>>(habitaciones);
            return Ok(habitacionesDTO);
        }

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

        [HttpPost]
        public async Task<ActionResult<HabitacionDTO>> CreateHabitacion(HabitacionCreateDTO habitacionDTO)
        {
            var habitacion = _mapper.Map<Habitacion>(habitacionDTO);

            if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion && 
            h.Planta == habitacionDTO.Planta && h.Edificio == habitacionDTO.Edificio))
            {
                return Conflict("Ya existe una habitación con el número proporcionado en este edificio y planta.");
            }

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            for (int i = 1; i <= 2; i++)
            {
                var cama = new Cama
                {
                    Ubicacion = $"{habitacionDTO.Edificio}{habitacionDTO.Planta}{habitacionDTO.NumeroHabitacion}{i:00}",
                    Estado = (EstadoCama)Enum.Parse(typeof(EstadoCama), "Disponible"),
                    Tipo = (TipoCama)Enum.Parse(typeof(TipoCama), habitacionDTO.TipoCama),
                    IdHabitacion = habitacion.IdHabitacion
                };
                _context.Camas.Add(cama);
            }

            await _context.SaveChangesAsync();

            var habitacionDTOResult = _mapper.Map<HabitacionDTO>(habitacion);
            return CreatedAtAction(nameof(GetHabitacion), new { id = habitacionDTOResult.IdHabitacion }, habitacionDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabitacion(int id, HabitacionUpdateDTO habitacionDTO)
        {
            var habitacionExistente = await _context.Habitaciones.FindAsync(id);

            if (habitacionExistente == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            _mapper.Map(habitacionDTO, habitacionExistente);

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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            var camasAsociadas = _context.Camas.Where(c => c.IdHabitacion == id);
            _context.Camas.RemoveRange(camasAsociadas);

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
