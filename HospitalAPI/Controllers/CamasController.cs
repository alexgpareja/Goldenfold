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

        /// <summary>
        /// Obtiene una lista de camas basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="ubicacion">La ubicación de la cama a buscar. Este parámetro es opcional.</param>
        /// <param name="estado">El estado de la cama a buscar. Este parámetro es opcional.</param>
        /// <param name="tipo">El tipo de la cama a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="CamaDTO"/> que representan los usuarios encontrados.
        /// </returns>
        /// <response code="200">Devuelve una lista de usuarios que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran usuarios que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Camas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CamaDTO>>> GetCamas([FromQuery] string? ubicacion, [FromQuery] string? estado, [FromQuery] string? tipo)
        {
             IQueryable<Cama> query = _context.Camas;

            if (!String.IsNullOrEmpty(ubicacion)) query = query.Where(c => c.Ubicacion.Contains(ubicacion!.ToLower()));
            if (!String.IsNullOrEmpty(estado)) query = query.Where(c => c.Estado.Contains(estado!.ToLower()));
            if (!String.IsNullOrEmpty(tipo)) query = query.Where(c => c.Tipo.Contains(tipo!.ToLower()));
            
            var camas = await query.ToListAsync();

            if (!camas.Any())
            {
                return NotFound("No se han encontrado camas.");
            }
            var camasDTO = _mapper.Map<IEnumerable<CamaDTO>>(camas);
            return Ok(camasDTO);
        }

          /// <summary>
        /// Obtiene una cama específica por su ID.
        /// </summary>
        /// <param name="id">El ID de la cama que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="CamaDTO"/> que representa la cama solicitada.
        /// </returns>
        /// <response code="200">Devuelve la cama solicitada.</response>
        /// <response code="404">Si no se encuentra una cama con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        
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

          /// <summary>
        /// Crea una nueva cama en la base de datos.
        /// </summary>
        /// <param name="CamaDTO">El objeto <see cref="CamaCreateDTO"/> que contiene los datos de la cama a crear.</param>
        /// <returns>
        /// Un objeto <see cref="CamaDTO"/> que representa la cama recién creada.
        /// </returns>
        /// <response code="201">La cama ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        
        // POST: api/Camas
        [HttpPost]
        public async Task<ActionResult<CamaDTO>> CreateCama(CamaCreateDTO camaDTO)
        {
            if (await _context.Camas.AnyAsync(c => c.Ubicacion == camaDTO.Ubicacion))
            {
                return Conflict("La ubicación de la cama ya está en uso.");
            }
            
            var cama = _mapper.Map<Cama>(camaDTO);

            _context.Camas.Add(cama);

            await _context.SaveChangesAsync();

            var camaDTOResult = _mapper.Map<CamaDTO>(cama);

            return CreatedAtAction(nameof(GetCamaByUbicacion), new { ubicacion = camaDTOResult.Ubicacion }, camaDTOResult);
        }


     /// <summary>
        /// Actualiza una cama existente en la base de datos.
        /// </summary>
        /// <param name="ubicacion">La ubicación de la cama que se va a actualizar.</param>
        /// <param name="estado">El estado de la cama que se va a actualizar.</param>
        /// <param name="tipo">El tipo de cama que se va a actualizar.</param>
        /// <param name="camaDTO">El objeto <see cref="CamaUpdateDTO"/> que contiene los datos actualizados de la cama.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID de la cama en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra la cama con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/Camas/{ubicacion}
        [HttpPut("{ubicacion}")]
        public async Task<IActionResult> UpdateCama(string ubicacion, CamaUpdateDTO camaDTO)
        {
            var camaExistente = await _context.Camas.FindAsync(ubicacion);

            if (ubicacion != camaDTO.Ubicacion)
            {
                return BadRequest("La ubicación de la cama proporcionada no coincide con la ubicación en la solicitud.");
            }
           
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

         /// <summary>
        /// Elimina una cama específica de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID de la cama que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra la cama con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        /// 
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
