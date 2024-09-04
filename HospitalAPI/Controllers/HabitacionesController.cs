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
        /// Crea una nueva habitación en la base de datos.
        /// </summary>
        /// <param name="HabitacionDTO">El objeto <see cref="HabitacionCreateDTO"/> que contiene los datos de la habitación a crear.</param>
        /// <returns>
        /// Un objeto <see cref="HabitacionDTO"/> que representa la habitación recién creada.
        /// </returns>
        /// <response code="201">La habitación ha sido creado exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Habitaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HabitacionDTO>>> GetHabitaciones([FromQuery] string? edifcio, [FromQuery] string? planta,  [FromQuery] string? numero_habitacion)
        {
            IQueryable<Habitacion> query = _context.Habitaciones;
            if (!edificio.IsNullOrEmpty()) query = query.Where(h => h.Edificio.Contains(edificio!.ToLower()));
            if (!planta.IsNullOrEmpty()) query = query.Where(h => h.Planta.Contains(planta!.ToLower()));
            if (!numero_habitacion.IsNullOrEmpty()) query = query.Where(h => h.NumeroHabitacion.Contains(numero_habitacion!.ToLower()));
            
            var usuarios = await query.ToListAsync();
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
        /// 
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

         /// <summary>
        /// Crea una nueva habitación en la base de datos.
        /// </summary>
        /// <param name="HabitacionDTO">El objeto <see cref="HabitacionCreateDTO"/> que contiene los datos de la habitación a crear.</param>
        /// <returns>
        /// Un objeto <see cref="HabitacionDTO"/> que representa la habitación recién creada.
        /// </returns>
        /// <response code="201">La habitación ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // POST: api/Habitaciones
        [HttpPost]
        public async Task<ActionResult<HabitacionDTO>> CreateHabitacion(HabitacionCreateDTO habitacionDTO)
        {
            if (await _context.Habitaciones.AnyAsync(h => h.NumeroHabitacion == habitacionDTO.NumeroHabitacion))
            {
                return Conflict("Ya existe una habitación con el número proporcionado.");
            }

            var habitacion = _mapper.Map<Habitacion>(habitacionDTO);

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            var habitacionDTOResult = _mapper.Map<habitacionDTO>(usuario);

            return CreatedAtAction(nameof(GetHabitacion), new { id = habitacionDTOResult.IdHabitacion }, habitacionDTOResult);
        }


           /// <summary>
        /// Actualiza una habitación existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID de la habitaicón que se va a actualizar.</param>
        /// <param name="HabitacionDTO">El objeto <see cref="HabitacionUpdateDTO"/> que contiene los datos actualizados de la habitación.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID de la habitación en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra la habitación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/Habitaciones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHabitacion(int id, HabitacionUpdateDTO habitacionDTO)
        {
            var habitacionExiste = await _context.Habitaciones.FindAsync(id);

            if (id != habitacionDTO.IdHabitacion)
            {
                return BadRequest("El ID de la habitación proporcionada no coincide con el ID en la solicitud.");
            }

   
            if (habitacionExiste == null)
            {
                return NotFound("No se ha encontrado ninguna habitación con el ID proporcionado.");
            }

            _mapper.Map(habitacionDTO, habitacionExiste);

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
        /// Elimina una habitación específico de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID de la habitación que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra la habitación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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
