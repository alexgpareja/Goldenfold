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

        /// <summary>
        /// Obtiene una lista de historiales de alta basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="id_paciente">El identificador del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="fecha_alta">La fecha de alta del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="diagnostico">El diagnostico del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="tratamiento">El tratamiento del paciente a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="HistorialAltaDTO"/> que representan los historiales de alta encontrados.
        /// </returns>
        /// <response code="200">Devuelve una lista de historiales de alta que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran historiales de alta que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/HistorialAltas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistorialAltaDTO>>> GetHistorialAltas([FromQuery] int? id_paciente, [FromQuery] DateTime? fecha_alta, [FromQuery] string? diagnostico, [FromQuery] string? tratamiento)
        {
            IQueryable<HistorialAlta> query = _context.HistorialesAltas;
            if (!(id_paciente == null)) query = query.Where(h => h.IdPaciente == id_paciente);
            if (!(fecha_alta == null)) query = query.Where(h => h.FechaAlta == fecha_alta);
            if (!String.IsNullOrEmpty(diagnostico)) query = query.Where(h => h.Diagnostico.Contains(diagnostico!.ToLower()));
            if (!String.IsNullOrEmpty(tratamiento)) query = query.Where(h => h.Tratamiento.Contains(tratamiento!.ToLower()));

            var historialAlta = await query.ToListAsync();

            if (!historialAlta.Any())
            {
                return NotFound("No se han encontrado altas.");
            }
            var historialAltasDTO = _mapper.Map<IEnumerable<HistorialAltaDTO>>(historialAlta);
            return Ok(historialAltasDTO);
        }

        /// <summary>
        /// Obtiene un historial de altas específico de un paciente por su número de seguridad social.
        /// </summary>
        /// <param name="id_historial">El identificador del historial de alta que se desea obtener.</param>
        /// <returns>Una respuesta HTTP que contiene el historial de alta en formato <see cref="HistorialAltaDTO"/> si se encuentra en la base de datos.</returns>
        /// <response code="200">Retorna un código HTTP 200 (OK) con el historial de alta en formato <see cref="HistorialAltaDTO"/> si el historial de alta se encuentra en la base de datos.</response>
        /// <response code="404">Retorna un código HTTP 404 (Not Found) si no se encuentra ningún historial de alta con el identificador proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
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

        /// <summary>
        /// Crea un nuevo historial de alta en la base de datos.
        /// </summary>
        /// <param name="HistorialAltaDTO">El objeto <see cref="HistorialAltaCreateDTO"/> que contiene los datos del historial de alta a crear.</param>
        /// <returns>
        /// Un objeto <see cref="HistorialAltaDTO"/> que representa el historial de alta recién creado.
        /// </returns>
        /// <response code="201">El historial de alta ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // POST: api/HistorialAltas
        [HttpPost]
        public async Task<ActionResult<HistorialAltaDTO>> CreateHistorialAlta(HistorialAltaCreateDTO historialAltaDTO)
        {
            // Buscar el paciente en la base de datos usando el IdPaciente del historialAltaDTO
            var paciente = await _context.Pacientes.FindAsync(historialAltaDTO.IdPaciente);
            if (paciente == null)
            {
                return NotFound("El paciente especificado no existe.");
            }

            // Buscar el médico en la base de datos usando el IdMedico del historialAltaDTO
            var medico = await _context.Usuarios.FindAsync(historialAltaDTO.IdMedico);
            if (medico == null)
            {
                return NotFound("El médico especificado no existe.");
            }

            // Cambiar el estado del paciente a "Alta"
            paciente.Estado = EstadoPaciente.Alta;  // Asegúrate de que "EstadoPaciente" es el Enum o string correcto

            // Buscar la consulta relacionada con el paciente
            var consulta = await _context.Consultas
    .Where(c => c.IdPaciente == historialAltaDTO.IdPaciente)
    .FirstOrDefaultAsync();


            if (consulta == null)
            {
                return NotFound("No se encontró una consulta pendiente para este paciente.");
            }

            // Cambiar el estado de la consulta a "completada"
            consulta.Estado = EstadoConsulta.completada;
            consulta.FechaConsulta = DateTime.Now;

            // Mapear el historial de alta desde el DTO
            var historialAlta = _mapper.Map<HistorialAlta>(historialAltaDTO);

            // Agregar el historial de alta a la base de datos
            _context.HistorialesAltas.Add(historialAlta);

            // Guardar los cambios (tanto para el historial de alta como para la consulta)
            await _context.SaveChangesAsync();

            // Mapear el historial de alta de vuelta a DTO para devolverlo
            var historialAltaDTOResult = _mapper.Map<HistorialAltaDTO>(historialAlta);

            // Devolver la respuesta creada con el ID del historial de alta
            return CreatedAtAction(nameof(GetHistorialAltas), new { id = historialAltaDTOResult.IdHistorial }, historialAltaDTOResult);
        }



        /// <summary>
        /// Actualiza un historial de alta existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID del historial de alta que se va a actualizar.</param>
        /// <param name="historialAltaDTO">El objeto <see cref="HistorialAltaUpdateDTO"/> que contiene los datos actualizados del historial de alta.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID del historial de alta en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra el historial de alta con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/HistorialAltas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHistorialAlta(int id, HistorialAltaUpdateDTO historialAltaDTO)
        {
            var historialAltaExiste = await _context.HistorialesAltas.FindAsync(id);

            if (historialAltaExiste == null)
            {
                return NotFound("No se encontró el historial especificado.");
            }

            _mapper.Map(historialAltaDTO, historialAltaExiste);

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

        /// <summary>
        /// Elimina un historial de alta específico de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID del historial de alta que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra el historial de alta con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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
