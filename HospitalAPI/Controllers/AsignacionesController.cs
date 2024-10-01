using Microsoft.AspNetCore.Mvc;
using HospitalApi.DTO;
using HospitalApi.Services;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsignacionesController : ControllerBase
    {
        private readonly AsignacionService _asignacionService;

        public AsignacionesController(AsignacionService asignacionService)
        {
            _asignacionService = asignacionService;
        }

        // Obtener todas las asignaciones con filtros opcionales
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDTO>>> GetAsignaciones(
            [FromQuery] int? idPaciente,
            [FromQuery] int? idCama,
            [FromQuery] DateTime? fechaAsignacion,
            [FromQuery] DateTime? fechaLiberacion,
            [FromQuery] int? asignadoPor)
        {
            var asignaciones = await _asignacionService.GetAsignacionesAsync(idPaciente, idCama, fechaAsignacion, fechaLiberacion, asignadoPor);

            if (!asignaciones.Any())
            {
                return NotFound("No se han encontrado asignaciones.");
            }

            return Ok(asignaciones);
        }

        // Obtener una asignación por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<AsignacionDTO>> GetAsignacion(int id)
        {
            var asignacion = await _asignacionService.GetAsignacionByIdAsync(id);
            if (asignacion == null)
            {
                return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
            }

            return Ok(asignacion);
        }

        // Crear una nueva asignación
        [HttpPost]
        public async Task<ActionResult<AsignacionDTO>> CreateAsignacion(AsignacionCreateDTO asignacionDTO)
        {
            try
            {
                var asignacion = await _asignacionService.CreateAsignacionAsync(asignacionDTO);
                return CreatedAtAction(nameof(GetAsignacion), new { id = asignacion.IdAsignacion }, asignacion);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Actualizar una asignación existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, AsignacionUpdateDTO asignacionDTO)
        {
            try
            {
                var result = await _asignacionService.UpdateAsignacionAsync(id, asignacionDTO);
                if (!result)
                {
                    return NotFound("No se ha encontrado ninguna asignación con el ID proporcionado.");
                }
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Eliminar una asignación
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id)
        {
            var result = await _asignacionService.DeleteAsignacionAsync(id);
            if (!result)
            {
                return NotFound("No se encontró la asignación especificada.");
            }

            return NoContent();
        }
    }
}
