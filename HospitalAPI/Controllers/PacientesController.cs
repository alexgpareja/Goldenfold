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

        /// <summary>
        /// Obtiene una lista de todos los pacientes.
        /// </summary>
        /// <returns>Una respuesta HTTP que contiene una lista de pacientes en formato <see cref="PacienteDTO"/>.</returns>
        /// <response code="200">Retorna un código HTTP 200 (OK) con una lista de pacientes en formato <see cref="PacienteDTO"/> si se encuentran pacientes en la base de datos.</response>
        /// <response code="404">Retorna un código HTTP 404 (Not Found) si no se encuentran pacientes en la base de datos.</response>
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


        /// <summary>
        /// Obtiene un paciente específico por su número de seguridad social.
        /// </summary>
        /// <param name="numeroSeguridadSocial">El número de seguridad social del paciente que se desea obtener.</param>
        /// <returns>Una respuesta HTTP que contiene el paciente en formato <see cref="PacienteDTO"/> si se encuentra en la base de datos.</returns>
        /// <response code="200">Retorna un código HTTP 200 (OK) con el paciente en formato <see cref="PacienteDTO"/> si el paciente se encuentra en la base de datos.</response>
        /// <response code="404">Retorna un código HTTP 404 (Not Found) si no se encuentra ningún paciente con el número de seguridad social proporcionado.</response>
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


        /// <summary>
        /// Obtiene una lista de pacientes que contienen el nombre proporcionado.
        /// </summary>
        /// <param name="nombre">El nombre del paciente que se desea buscar. Se realizará una búsqueda que contenga este nombre.</param>
        /// <returns>Una respuesta HTTP que contiene una lista de pacientes en formato <see cref="PacienteDTO"/> si se encuentran en la base de datos.</returns>
        /// <response code="200">Retorna un código HTTP 200 (OK) con una lista de pacientes en formato <see cref="PacienteDTO"/> si se encuentran pacientes que coincidan con el nombre proporcionado.</response>
        /// <response code="404">Retorna un código HTTP 404 (Not Found) si no se encuentra ningún paciente con el nombre proporcionado.</response>
        // GET: api/Pacientes/ByName/{nombre}
        [HttpGet("ByName/{nombre}")]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientesByName(string nombre)
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


        /// <summary>
        /// Crea un nuevo paciente.
        /// </summary>
        /// <param name="pacienteDTO">Datos del paciente a crear.</param>
        /// <returns>El paciente creado.</returns>
        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCreateDTO pacienteDTO)
        {
            // Verificar si ya existe un paciente con el mismo número de seguridad social en la bd
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            // Validar el formato del número de seguridad social
            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            // Comprobar que la fecha de nacimiento sea válida
            if (pacienteDTO.FechaNacimiento > DateTime.Now)
            {
                return BadRequest("La fecha de nacimiento no puede ser en el futuro.");
            }

            // Validar formato de email si se proporciona
            if (!string.IsNullOrEmpty(pacienteDTO.Email) && !new EmailAddressAttribute().IsValid(pacienteDTO.Email))
            {
                return BadRequest("El formato del email proporcionado no es válido.");
            }

            // Validar formato de teléfono si se proporciona
            if (!string.IsNullOrEmpty(pacienteDTO.Telefono) && !Regex.IsMatch(pacienteDTO.Telefono, @"^\d{9}$"))
            {
                return BadRequest("El formato del número de teléfono proporcionado no es válido. Debe tener exactamente 9 dígitos.");
            }

            var paciente = _mapper.Map<Paciente>(pacienteDTO);

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            var pacienteDTOResult = _mapper.Map<PacienteDTO>(paciente);
            return CreatedAtAction(nameof(GetPaciente), new { numeroSeguridadSocial = pacienteDTO.SeguridadSocial }, pacienteDTOResult);

        }


        /// <summary>
        /// Actualiza la información de un paciente existente.
        /// </summary>
        /// <param name="id">El ID del paciente a actualizar.</param>
        /// <param name="pacienteDTO">Los datos actualizados del paciente.</param>
        /// <returns>Una respuesta HTTP indicando el resultado de la operación.</returns>
        /// <response code="204">Si la actualización fue exitosa.</response>
        /// <response code="400">Si hay un problema con los datos proporcionados.</response>
        /// <response code="404">Si no se encuentra el paciente especificado.</response>
        /// <response code="409">Si ya existe un paciente con el mismo número de seguridad social.</response>
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

            // Verificar si ya existe un paciente con el mismo número de seguridad social en la bd
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial && p.IdPaciente != id))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            // Validar el formato del número de seguridad social
            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            // Comprobar que la fecha de nacimiento sea válida
            if (pacienteDTO.FechaNacimiento > DateTime.Now)
            {
                return BadRequest("La fecha de nacimiento no puede ser en el futuro.");
            }

            // Validar formato de email si se proporciona
            if (!string.IsNullOrEmpty(pacienteDTO.Email) && !new EmailAddressAttribute().IsValid(pacienteDTO.Email))
            {
                return BadRequest("El formato del email proporcionado no es válido.");
            }

            // Validar formato de teléfono si se proporciona
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


        /// <summary>
        /// Elimina un paciente por su ID.
        /// </summary>
        /// <param name="id">El ID del paciente a eliminar.</param>
        /// <returns>Una respuesta HTTP indicando el resultado de la operación.</returns>
        /// <response code="204">Si la eliminación fue exitosa.</response>
        /// <response code="404">Si no se encuentra el paciente especificado.</response>
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

