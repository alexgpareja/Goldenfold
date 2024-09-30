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

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultaDTO>>> GetConsultas(
            [FromQuery] int? idPaciente, 
            [FromQuery] int? idMedico, 
            [FromQuery] string? estado)
        {
            IQueryable<Consulta> query = _context.Consultas;
            if (idPaciente.HasValue)
                query = query.Where(c => c.IdPaciente == idPaciente.Value);
            if (idMedico.HasValue)
                query = query.Where(c => c.IdMedico == idMedico.Value);
            if (!string.IsNullOrEmpty(estado))
            {
                if (Enum.TryParse(typeof(EstadoConsulta), estado, true, out var estadoEnum)){
                    query = query.Where(c => c.Estado == (EstadoConsulta)estadoEnum);
                }
                else{
                    return BadRequest("El valor de estado no es válido.");
                }
            }
            var consultas = await query.ToListAsync();
            var consultasDTO = _mapper.Map<IEnumerable<ConsultaDTO>>(consultas);
            return Ok(consultasDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultaDTO>> GetConsultaById(int id)
        {
            var consulta = await _context.Consultas
                .Include(c => c.Paciente) 
                .FirstOrDefaultAsync(c => c.IdConsulta == id);

            if (consulta == null)
            {
                return NotFound();
            }

            var consultaDTO = _mapper.Map<ConsultaDTO>(consulta);
            return Ok(consultaDTO);
        }

        [HttpPost]
        public async Task<ActionResult<ConsultaDTO>> CreateConsulta(ConsultaCreateDTO consultaDTO)
        {
            var consulta = _mapper.Map<Consulta>(consultaDTO);
            var paciente = await _context.Pacientes.FindAsync(consultaDTO.IdPaciente);
            if (paciente == null)
            {
                return NotFound("El paciente especificado no existe.");
            }

            paciente.Estado = EstadoPaciente.EnConsulta; 
            _context.Consultas.Add(consulta);

            await _context.SaveChangesAsync();
            var consultaDTOResult = _mapper.Map<ConsultaDTO>(consulta);
            return CreatedAtAction(nameof(GetConsultaById), new { id = consultaDTOResult.IdConsulta }, consultaDTOResult);
        }

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
