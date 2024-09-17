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

        /// <summary>
        /// Obtiene una lista de habitaciones basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="edificio">El nombre del edificio donde se encuentran las habitaciones. Este parámetro es opcional.</param>
        /// <param name="planta">El número de la planta donde se encuentran las habitaciones. Este parámetro es opcional.</param>
        /// <param name="numeroHabitacion">El número de la habitación. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="HabitacionDTO"/> que representan las habitaciones encontradas.
        /// </returns>
        /// <response code="200">Devuelve una lista de habitaciones que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran habitaciones que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitacionDTO>>> GetHabitaciones([FromQuery] string? edificio, [FromQuery] string? planta, [FromQuery] string? numeroHabitacion)
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

        /// <summary>
        /// Obtiene una habitación específica por su ID.
        /// </summary>
        /// <param name="id">El ID de la habitación que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="HabitacionDTO"/> que representa la habitación solicitada.
        /// </returns>
        /// <response code="200">Devuelve la habitación solicitada.</response>
        /// <response code="404">Si no se encuentra una habitación con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
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

        /// <summary>
        /// Crea una nueva habitación y sus camas asociadas automáticamente.
        /// </summary>
        /// <param name="habitacionDTO">El objeto <see cref="HabitacionCreateDTO"/> que contiene los datos de la habitación a crear.</param>
        /// <returns>
        /// Un objeto <see cref="HabitacionDTO"/> que representa la habitación recién creada.
        /// </returns>
        /// <response code="201">La habitación ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="409">Si ya existe una habitación con el mismo número en la planta y edificio especificados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpPost]
        public async Task<ActionResult<HabitacionDTO>> CreateHabitacion(HabitacionCreateDTO habitacionDTO)
        {
            var habitacion = _mapper.Map<Habitacion>(habitacionDTO);

            // Verificar si ya existe una habitación con el número proporcionado
            if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion && h.Planta == habitacionDTO.Planta && h.Edificio == habitacionDTO.Edificio))
            {
                return Conflict("Ya existe una habitación con el número proporcionado en este edificio y planta.");
            }

            // Añadir la habitación a la base de datos
            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            // Crear automáticamente las camas asociadas a la habitación
            for (int i = 1; i <= 2; i++) // Se asume que cada habitación tiene 2 camas
            {
                var cama = new Cama
                {
                    Ubicacion = $"{habitacionDTO.Edificio}{habitacionDTO.Planta}{habitacionDTO.NumeroHabitacion}{i:00}",
                    Estado = (EstadoCama)Enum.Parse(typeof(EstadoCama), "Disponible"),
                    Tipo = (TipoCama)Enum.Parse(typeof(TipoCama), "General"),  // Se podría hacer más dinámico según el tipo de habitación
                    IdHabitacion = habitacion.IdHabitacion
                };
                _context.Camas.Add(cama);
            }

            await _context.SaveChangesAsync();

            var habitacionDTOResult = _mapper.Map<HabitacionDTO>(habitacion);
            return CreatedAtAction(nameof(GetHabitacion), new { id = habitacionDTOResult.IdHabitacion }, habitacionDTOResult);
        }

        /// <summary>
        /// Actualiza una habitación existente.
        /// </summary>
        /// <param name="id">El ID de la habitación que se va a actualizar.</param>
        /// <param name="habitacionDTO">El objeto <see cref="HabitacionUpdateDTO"/> que contiene los datos actualizados de la habitación.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="404">Si no se encuentra una habitación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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

        /// <summary>
        /// Elimina una habitación junto con sus camas asociadas.
        /// </summary>
        /// <param name="id">El ID de la habitación que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.</returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra una habitación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);
            if (habitacion == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            // Eliminar las camas asociadas a la habitación
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
