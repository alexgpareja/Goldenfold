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

        // GET: api/Pacientes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> GetPacienteById(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con este ID.");
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
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteDTO pacienteDTO)
        {
            var paciente = _mapper.Map<Paciente>(pacienteDTO);
            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();
            var pacienteDTOResult = _mapper.Map<PacienteDTO>(paciente);
            return CreatedAtAction(nameof(GetPacienteById), new { id = paciente.IdPaciente }, pacienteDTOResult);
        }

        // PUT: api/Pacientes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaciente(int id, PacienteDTO pacienteDTO)
        {
            if (id != pacienteDTO.IdPaciente)
            {
                return BadRequest("El ID del paciente proporcionado no coincide con el ID en la solicitud.");
            }
            var pacienteExiste = await _context.Pacientes.FindAsync(id);
            if (pacienteExiste == null)
            {
                return NotFound("No se encontró el paciente especificado.");
            }
            _mapper.Map(pacienteDTO, pacienteExiste);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PacienteExists(id))
                {
                    return NotFound("No se encontró el paciente especificado.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/Pacientes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound("No se encontró el paciente especificado.");
            }
            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PacienteExists(int id)
        {
            return _context.Pacientes.Any(p => p.IdPaciente == id);
        }
    }
}







































/*
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
        public async Task<ActionResult<PacienteDTO>> GetPacienteBySegSoc(string numeroSeguridadSocial)
        {
            var paciente = await _context.Pacientes
                .Where(p => p.SeguridadSocial.Contains(numeroSeguridadSocial.ToLower))
                .ToListAsync();
            if (!paciente.Any())
            {
                return NotFound("No se ha encontrado ningún paciente con el número de seguridad social proporcionado.");
            }
            var pacienteDTO = _mapper.Map<IEnumerable<PacienteDTO>>(paciente);
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
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteDTO pacienteDTO)
        {
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            if (!DateOnly.TryParseExact(pacienteDTO.FechaNacimiento, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly fechaNacimiento))
            {
                return BadRequest("La fecha de nacimiento debe estar en el formato AAAA-MM-DD.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Email) && !new EmailAddressAttribute().IsValid(pacienteDTO.Email))
            {
                return BadRequest("El formato del email proporcionado no es válido.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Telefono) && !Regex.IsMatch(pacienteDTO.Telefono, @"^\d{9}$"))
            {
                return BadRequest("El formato del número de teléfono proporcionado no es válido. Debe tener exactamente 9 dígitos.");
            }

            var paciente = _mapper.Map<Paciente>(pacienteDTO);
            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();
            var pacienteDTOResult = _mapper.Map<PacienteDTO>(paciente);
            return CreatedAtAction(nameof(GetPacienteBySegSoc, new { numeroSeguridadSocial = pacienteDTO.SeguridadSocial }, pacienteDTOResult);
        }

        // PUT: api/Pacientes/{numeroSeguridadSocial}
        [HttpPut("{numeroSeguridadSocial}")]
        public async Task<IActionResult> UpdatePaciente(string numeroSeguridadSocial, PacienteDTO pacienteDTO)
        {
            var paciente = await _context.Pacientes
                .FirstOrDefaultAsync(p => p.SeguridadSocial == numeroSeguridadSocial);
            if (paciente == null)
            {
                return NotFound("No se ha encontrado ningún paciente con el número de seguridad social proporcionado.");
            }

            string estado = pacienteDTO.Estado.Trim().ToLower();
            if (estado != "pendiente de cama" && estado != "en cama")
            {
                return BadRequest("El estado proporcionado no es válido. Solo se permiten 'Pendiente de cama' o 'En cama'.");
            }

            pacienteDTO.Estado = char.ToUpper(pacienteDTO.Estado[0]) + pacienteDTO.Estado.Substring(1).ToLower();

            if (!DateOnly.TryParseExact(pacienteDTO.FechaNacimiento, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateOnly fechaNacimiento))
            {
                return BadRequest("La fecha de nacimiento debe estar en el formato AAAA-MM-DD.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Email) && !new EmailAddressAttribute().IsValid(pacienteDTO.Email))
            {
                return BadRequest("El formato del email proporcionado no es válido.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Telefono) && !Regex.IsMatch(pacienteDTO.Telefono, @"^\d{9}$"))
            {
                return BadRequest("El formato del número de teléfono proporcionado no es válido. Debe tener exactamente 9 dígitos.");
            }
            _mapper.Map(pacienteDTO, paciente);
            paciente.FechaNacimiento = fechaNacimiento;
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

        private bool PacienteExists(string numeroSeguridadSocial)
        {
            return _context.Pacientes.Any(p => p.SeguridadSocial == numeroSeguridadSocial);
        }
    }
}
*/
