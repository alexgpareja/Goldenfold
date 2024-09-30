using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Text.RegularExpressions;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes(
            [FromQuery] string? nombre, 
            [FromQuery] string? numSS)
        {
            IQueryable<Paciente> query = _context.Pacientes;
            nombre = nombre?.Trim();
            numSS = numSS?.Trim();

            // Aplica los filtros si están presentes
            if (!string.IsNullOrEmpty(nombre) && !string.IsNullOrEmpty(numSS))
            {
                query = query.Where(p => p.Nombre.ToLower().Contains(nombre.ToLower()) && p.SeguridadSocial.Trim() == numSS);
            }
            else if (!string.IsNullOrEmpty(nombre))
            {
                query = query.Where(p => p.Nombre.ToLower().Contains(nombre.ToLower()));
            }
            else if (!string.IsNullOrEmpty(numSS))
            {
                query = query.Where(p => p.SeguridadSocial.Trim() == numSS);
            }
            var pacientes = await query.ToListAsync();

            if (!pacientes.Any())
            {
                return NotFound("No se han encontrado pacientes que coincidan con el nombre y número de seguridad social proporcionados.");
            }

            var pacientesDTO = _mapper.Map<IEnumerable<PacienteDTO>>(pacientes);
            return Ok(pacientesDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> GetPaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound($"No se ha encontrado ningún paciente con el ID {id}.");

            var pacienteDTO = _mapper.Map<PacienteDTO>(paciente);
            return Ok(pacienteDTO);
        }

        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCreateDTO pacienteDTO)
        {
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            if (await _context.Pacientes.AnyAsync(p => p.Dni == pacienteDTO.Dni))
            {
                return Conflict("Ya existe un paciente con el DNI proporcionado.");
            }

            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            if (!Regex.IsMatch(pacienteDTO.Dni, @"^\d{8}[A-Za-z]$"))
            {
                return BadRequest("El DNI debe tener 8 números seguidos de una letra.");
            }

            if (pacienteDTO.FechaNacimiento > DateTime.Now)
            {
                return BadRequest("La fecha de nacimiento no puede ser en el futuro.");
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
            return CreatedAtAction(nameof(GetPaciente), new { id = paciente.IdPaciente }, pacienteDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaciente(int id, PacienteUpdateDTO pacienteDTO)
        {
            var pacienteExiste = await _context.Pacientes.FindAsync(id);
            if (pacienteExiste == null) return NotFound("No se encontró el paciente especificado.");

            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial && p.IdPaciente != id))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            if (await _context.Pacientes.AnyAsync(p => p.Dni == pacienteDTO.Dni && p.IdPaciente != id))
            {
                return Conflict("Ya existe un paciente con el DNI proporcionado.");
            }

            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            if (!Regex.IsMatch(pacienteDTO.Dni, @"^\d{8}[A-Za-z]$"))
            {
                return BadRequest("El DNI debe tener 8 números seguidos de una letra.");
            }

            if (pacienteDTO.FechaNacimiento > DateTime.Now)
            {
                return BadRequest("La fecha de nacimiento no puede ser en el futuro.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Email) && !new EmailAddressAttribute().IsValid(pacienteDTO.Email))
            {
                return BadRequest("El formato del email proporcionado no es válido.");
            }

            if (!string.IsNullOrEmpty(pacienteDTO.Telefono) && !Regex.IsMatch(pacienteDTO.Telefono, @"^\d{9}$"))
            {
                return BadRequest("El formato del número de teléfono proporcionado no es válido. Debe tener exactamente 9 dígitos.");
            }

            _mapper.Map(pacienteDTO, pacienteExiste);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PacienteExists(id)) return NotFound("No se encontró el paciente especificado.");
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound("No se encontró el paciente especificado.");

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
