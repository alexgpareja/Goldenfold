using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public PacientesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Pacientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes()
        {
            var pacientes = await _context.Pacientes.ToListAsync();

            if (!pacientes.Any())
            {
                return NotFound("No se han encontrado pacientes.");
            }

            var pacientesDTO = _mapper.Map<IEnumerable<PacienteDTO>>(pacientes);

            return Ok(pacientesDTO);
        }

        // GET: api/Pacientes/{numeroSeguridadSocial}
        [HttpGet("{numeroSeguridadSocial}")]
        public async Task<ActionResult<PacienteDTO>> GetPaciente(string numeroSeguridadSocial)
        {
            // Busca el paciente con el número de seguridad social proporcionado
            var paciente = await _context.Pacientes
                .FirstOrDefaultAsync(p => p.SeguridadSocial == numeroSeguridadSocial);

            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con el número de seguridad social proporcionado.");
            }

            var pacienteDTO = _mapper.Map<PacienteDTO>(paciente);

            return Ok(pacienteDTO);
        }

        // GET: api/Pacientes/ByName/{nombre}
        [HttpGet("ByName/{nombre}")]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacienteByName(string nombre)
        {
            var pacientes = await _context.Pacientes
                .Where(p => p.Nombre.Contains(nombre))
                .ToListAsync();

            if (!pacientes.Any())
            {
                return NotFound("No se ha encontrado ningún paciente con este nombre.");
            }

            var pacientesDTO = _mapper.Map<IEnumerable<PacienteDTO>>(pacientes);
            return Ok(pacientesDTO);
        }

        // POST: api/Pacientes
        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCreateDTO pacienteDTO)
        {
            // Verificar si ya existe un paciente con el mismo número de seguridad social en la bd
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            var paciente = _mapper.Map<Paciente>(pacienteDTO);

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            var pacienteCreatedDTO = _mapper.Map<PacienteDTO>(paciente);

            return CreatedAtAction(nameof(GetPaciente), new { numeroSeguridadSocial = pacienteDTO.SeguridadSocial }, pacienteCreatedDTO);
        }


        // PUT: api/Pacientes/{numeroSeguridadSocial}
        [HttpPut("{numeroSeguridadSocial}")]
        public async Task<IActionResult> EditPaciente(string numeroSeguridadSocial, PacienteDTO pacienteDTO)
        {
            var paciente = await _context.Pacientes.FirstOrDefaultAsync(p => p.SeguridadSocial == numeroSeguridadSocial);

            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con ese número de seguridad social.");
            }

            // Validar el estado
            string estado = pacienteDTO.Estado.ToLower();
            if (estado != "pendiente de cama" && estado != "en cama")
            {
                return BadRequest("El estado proporcionado no es válido. Solo se permiten 'Pendiente de cama' o 'En cama'.");
            }

            // Formatear el string del formato 
            pacienteDTO.Estado = char.ToUpper(pacienteDTO.Estado[0]) + pacienteDTO.Estado.Substring(1).ToLower();

            _mapper.Map(pacienteDTO, paciente);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Ocurrió un error al actualizar el paciente.");
            }

            return NoContent();
        }

        // PUT: api/Pacientes/ByName/{nombre}
        [HttpPut("ByName/{nombre}")]
        public async Task<IActionResult> EditPacienteByName(string nombre, PacienteDTO pacienteDTO)
        {
            // Buscar al paciente por nombre
            var paciente = await _context.Pacientes
                .Where(p => p.Nombre == nombre) 
                .Select(p => new { p.SeguridadSocial })
                .FirstOrDefaultAsync();

            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con ese nombre.");
            }

            // Llama al método PUT existente para actualizar el paciente usando el número de seguridad social
            return await EditPaciente(paciente.SeguridadSocial, pacienteDTO);
        }

        // DELETE: api/Pacientes/{numeroSeguridadSocial}
        [HttpDelete("{numeroSeguridadSocial}")]
        public async Task<IActionResult> DeletePaciente(string numeroSeguridadSocial)
        {
            var paciente = await _context.Pacientes
                .FirstOrDefaultAsync(p => p.SeguridadSocial == numeroSeguridadSocial);

            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con el número de seguridad social proporcionado.");
            }

            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/Pacientes/ByName/{nombre}
        [HttpDelete("ByName/{nombre}")]
        public async Task<IActionResult> DeletePacienteByName(string nombre)
        {
            // Buscar al paciente por nombre
            var paciente = await _context.Pacientes
                .Where(p => p.Nombre == nombre) // Asume que tienes una propiedad Nombre en el modelo Paciente
                .Select(p => new { p.SeguridadSocial }) // Selecciona el número de seguridad social
                .FirstOrDefaultAsync();

            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con el nombre proporcionado.");
            }

            // Llama al método DELETE existente usando el número de seguridad social
            return await DeletePaciente(paciente.SeguridadSocial);
        }


        private bool PacienteExists(int id)
        {
            return _context.Pacientes.Any(e => e.IdPaciente == id);
        }

        private bool PacienteExists(string numeroSeguridadSocial)
        {
            return _context.Pacientes.Any(p => p.SeguridadSocial == numeroSeguridadSocial);
        }
    }
}
