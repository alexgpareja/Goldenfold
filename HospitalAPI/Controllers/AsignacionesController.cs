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

        /// <summary>
        /// Obtiene una lista de asignaciones basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="id_paciente">El identificador del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="ubicacion">La ubicación de la asignación a buscar. Este parámetro es opcional.</param>
        /// <param name="fecha_asignacion">La fecha de asignación a buscar. Este parámetro es opcional.</param>
        /// <param name="fecha_liberacion">La fecha de liberación a buscar. Este parámetro es opcional.</param>
        /// <param name="asignado_por">El identificador del usuario de la asignación a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="AsignacionDTO"/> que representan las asignaciones encontradas.
        /// </returns>
        /// <response code="200">Devuelve una lista de asignaciones que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran asignaciones que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Asignaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDTO>>> GetAsignaciones([FromQuery] int? id_paciente, [FromQuery] string? ubicacion, [FromQuery] DateTime? fecha_asignacion, [FromQuery] DateTime? fecha_liberacion, [FromQuery] int? asignado_por)
        {
            IQueryable<Asignacion> query = _context.Asignaciones;
            if (!(id_paciente == null)) query = query.Where(a => a.IdPaciente == id_paciente);
            if (!String.IsNullOrEmpty(ubicacion)) query = query.Where(a => a.Ubicacion.Contains(ubicacion!.ToLower()));
            if (!(fecha_asignacion == null)) query = query.Where(a => a.FechaAsignacion == fecha_asignacion);
            if (!(fecha_liberacion == null)) query = query.Where(a => a.FechaLiberacion == fecha_liberacion);
            if (!(asignado_por == null)) query = query.Where(a => a.AsignadoPor == asignado_por);
            
            var asignaciones = await query.ToListAsync();

            if (!asignaciones.Any())
            {
                return NotFound("No se han encontrado asignaciones.");
            }
            var asignacionesDTO = _mapper.Map<IEnumerable<AsignacionDTO>>(asignaciones);
            return Ok(asignacionesDTO);
        }

        /// <summary>
        /// Obtiene una asignación específica por su ID.
        /// </summary>
        /// <param name="id">El ID de la asignación que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="AsignacionDTO"/> que representa la asignación solicitada.
        /// </returns>
        /// <response code="200">Devuelve la asignación solicitada.</response>
        /// <response code="404">Si no se encuentra una asignación con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
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

        /// <summary>
        /// Crea una nueva asignación en la base de datos.
        /// </summary>
        /// <param name="asignacionDTO">El objeto <see cref="AsignacionCreateDTO"/> que contiene los datos de la asignación a crear.</param>
        /// <returns>
        /// Un objeto <see cref="AsignacionDTO"/> que representa la asignación recién creada.
        /// </returns>
        /// <response code="201">La asignación ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // POST: api/Asignaciones
        [HttpPost]
        public async Task<ActionResult<AsignacionDTO>> CreateAsignacion(AsignacionCreateDTO asignacionDTO)
        {
            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado no existe. Por favor, selecciona un usuario válido para la asignación.");
            }
            
            var asignacion = _mapper.Map<Asignacion>(asignacionDTO);
            
            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();
            
            var asignacionDTOResult = _mapper.Map<AsignacionDTO>(asignacion);
            return CreatedAtAction(nameof(GetAsignacion), new { id = asignacionDTOResult.IdAsignacion }, asignacionDTOResult);
        }

         /// <summary>
        /// Actualiza una asignación existente en la base de datos.
        /// </summary>
        /// <param name="id_paciente">Elidentificador del paciente a actualizar. Este parámetro es opcional.</param>
        /// <param name="ubicacion">La ubicación de la asignación a actualizar. Este parámetro es opcional.</param>
         /// <param name="fecha_asignacion">La fecha de asignación a actualizar. Este parámetro es opcional.</param>
        /// <param name="fecha_liberacion">La fecha de liberación a actualizar. Este parámetro es opcional.</param>
         /// <param name="asignado_por">El identificador del usuario de la asignación a actualizar. Este parámetro es opcional.</param>
        /// <param name="AsignacionDTO">El objeto <see cref="AsignacionUpdateDTO"/> que contiene los datos actualizados de la asignación.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID de la asignación en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra la asignación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/Asignaciones/{id}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, AsignacionUpdateDTO asignacionDTO)
        {
        
            var asignacionExiste = await _context.Asignaciones.FindAsync(id);
            
            if (asignacionExiste == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }


            if (!await _context.Usuarios.AnyAsync(u => u.IdUsuario == asignacionDTO.AsignadoPor))
            {
                return Conflict("El usuario proporcionado para esta asignación no existe. Por favor, selecciona un usuario válido para la asignación.");
            }

            _mapper.Map(asignacionDTO, asignacionExiste);

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

        /// <summary>
        /// Elimina una asignación específica de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID de la asignación que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra la asignación con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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
