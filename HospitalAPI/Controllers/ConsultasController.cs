using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.DTO;
using HospitalApi.Models;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ConsultasController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de consultas basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="idPaciente">El ID del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="idMedico">El ID del médico a buscar. Este parámetro es opcional.</param>
        /// <param name="estado">El estado de la consulta a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="ConsultaDTO"/> que representan las consultas encontradas.
        /// </returns>
        /// <response code="200">Devuelve una lista de consultas que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran consultas que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Consultas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaDTO>>> GetConsultas([FromQuery] int? idPaciente, [FromQuery] int? idMedico, [FromQuery] string? estado)
        {
            IQueryable<Consulta> query = _context.Consultas;
            // Filtrar por paciente si se ha proporcionado
            if (idPaciente.HasValue)
                query = query.Where(c => c.IdPaciente == idPaciente.Value);
            // Filtrar por médico si se ha proporcionado
            if (idMedico.HasValue)
                query = query.Where(c => c.IdMedico == idMedico.Value);
            // Filtrar por estado si se ha proporcionado
            if (!string.IsNullOrEmpty(estado))
            {
                if (Enum.TryParse(typeof(EstadoConsulta), estado, true, out var estadoEnum)){
                    query = query.Where(c => c.Estado == (EstadoConsulta)estadoEnum);
                }
                else{
                    return BadRequest("El valor de estado no es válido.");
                }
            }
            // Ejecutar la consulta y obtener los resultados
            var consultas = await query.ToListAsync();
            var consultasDTO = _mapper.Map<IEnumerable<ConsultaDTO>>(consultas);
            return Ok(consultasDTO);
        }




        /// <summary>
        /// Obtiene una consulta específica por su ID.
        /// </summary>
        /// <param name="id">El ID de la consulta que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="ConsultaDTO"/> que representa la consulta solicitada.
        /// </returns>
        /// <response code="200">Devuelve la consulta solicitada.</response>
        /// <response code="404">Si no se encuentra una consulta con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Consultas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaDTO>> GetConsultaById(int id)
        {
            var consulta = await _context.Consultas
                .Include(c => c.Paciente) // Incluir los datos del paciente
                .FirstOrDefaultAsync(c => c.IdConsulta == id);

            if (consulta == null)
            {
                return NotFound();
            }

            var consultaDTO = _mapper.Map<ConsultaDTO>(consulta);
            return Ok(consultaDTO);
        }


        /// <summary>
        /// Crea una nueva consulta en la base de datos.
        /// </summary>
        /// <param name="consultaDTO">El objeto <see cref="ConsultaCreateDTO"/> que contiene los datos de la consulta a crear.</param>
        /// <returns>
        /// Un objeto <see cref="ConsultaDTO"/> que representa la consulta recién creada.
        /// </returns>
        /// <response code="201">La consulta ha sido creada exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // POST: api/Consultas
        [HttpPost]
        public async Task<ActionResult<ConsultaDTO>> CreateConsulta(ConsultaCreateDTO consultaDTO)
        {
            // Mapear la consulta desde el DTO
            var consulta = _mapper.Map<Consulta>(consultaDTO);

            // Buscar el paciente en la base de datos
            var paciente = await _context.Pacientes.FindAsync(consultaDTO.IdPaciente);
            if (paciente == null)
            {
                return NotFound("El paciente especificado no existe.");
            }

            // Cambiar el estado del paciente a "EnConsulta"
            paciente.Estado = EstadoPaciente.EnConsulta;  // Aquí asegúrate de que "EstadoPaciente" sea el Enum correcto o string

            // Agregar la consulta a la base de datos
            _context.Consultas.Add(consulta);

            // Guardar los cambios
            await _context.SaveChangesAsync();

            // Mapear la consulta de vuelta a DTO para devolverla
            var consultaDTOResult = _mapper.Map<ConsultaDTO>(consulta);

            // Devolver la respuesta creada con el ID de la consulta
            return CreatedAtAction(nameof(GetConsultaById), new { id = consultaDTOResult.IdConsulta }, consultaDTOResult);
        }


        /// <summary>
        /// Actualiza una consulta existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID de la consulta que se va a actualizar.</param>
        /// <param name="consultaDTO">El objeto <see cref="ConsultaUpdateDTO"/> que contiene los datos actualizados de la consulta.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID de la consulta en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra la consulta con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/Consultas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsulta(int id, ConsultaUpdateDTO consultaDTO)
        {
            if (id != consultaDTO.IdConsulta)
            {
                return BadRequest("El ID proporcionado no coincide con el ID de la consulta.");
            }

            var consultaExiste = await _context.Consultas.FindAsync(id);

            if (consultaExiste == null)
            {
                return NotFound($"No se encontró ninguna consulta con el ID {id}.");
            }

            _mapper.Map(consultaDTO, consultaExiste);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Consultas.Any(c => c.IdConsulta == id))
                {
                    return NotFound($"No se encontró ninguna consulta con el ID {id}.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Elimina una consulta específica de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID de la consulta que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra la consulta con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsulta(int id)
        {
            var consulta = await _context.Consultas.FindAsync(id);

            if (consulta == null)
            {
                return NotFound($"No se encontró ninguna consulta con el ID {id}.");
            }

            _context.Consultas.Remove(consulta);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
