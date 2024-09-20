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
        /// Obtiene una lista de pacientes basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="nombre">El nombre o parte del nombre del paciente a buscar. Este parámetro es opcional.</param>
        /// <param name="numSS">El número de la Seguirdad Social del paciente o parte de este a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="PacienteDTO"/> que representan los pacientes encontrados.
        /// </returns>
        /// <response code="200">Devuelve una lista de pacientes que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran pacientes que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes([FromQuery] string? nombre, [FromQuery] string? numSS)
        {
            // Empieza creando la consulta básica
            IQueryable<Paciente> query = _context.Pacientes;

            // Limpiar entradas eliminando espacios adicionales
            nombre = nombre?.Trim();
            numSS = numSS?.Trim();

            // Aplica los filtros si están presentes
            if (!string.IsNullOrEmpty(nombre) && !string.IsNullOrEmpty(numSS))
            {
                // Buscar pacientes que coincidan con ambos criterios (nombre y número de seguridad social)
                query = query.Where(p => p.Nombre.ToLower().Contains(nombre.ToLower()) && p.SeguridadSocial.Trim() == numSS);
            }
            else if (!string.IsNullOrEmpty(nombre))
            {
                // Si solo el nombre está presente
                query = query.Where(p => p.Nombre.ToLower().Contains(nombre.ToLower()));
            }
            else if (!string.IsNullOrEmpty(numSS))
            {
                // Si solo el número de seguridad social está presente
                query = query.Where(p => p.SeguridadSocial.Trim() == numSS);
            }

            // Ejecuta la consulta y obtén los resultados
            var pacientes = await query.ToListAsync();

            // Verifica si se encontraron resultados
            if (!pacientes.Any())
            {
                return NotFound("No se han encontrado pacientes que coincidan con el nombre y número de seguridad social proporcionados.");
            }

            // Mapea los pacientes a DTOs y devuélvelos
            var pacientesDTO = _mapper.Map<IEnumerable<PacienteDTO>>(pacientes);
            return Ok(pacientesDTO);
        }



        /// <summary>
        /// Obtiene un paciente específico por su ID.
        /// </summary>
        /// <param name="id">El ID del paciente que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="PacienteDTO"/> que representa el paciente solicitado.
        /// </returns>
        /// <response code="200">Devuelve el paciente solicitado.</response>
        /// <response code="404">Si no se encuentra un paciente con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> GetPaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null) return NotFound($"No se ha encontrado ningún paciente con el ID {id}.");

            var pacienteDTO = _mapper.Map<PacienteDTO>(paciente);
            return Ok(pacienteDTO);
        }

        /// <summary>
        /// Crea un nuevo paciente en la base de datos.
        /// </summary>
        /// <param name="pacienteDTO">El objeto <see cref="PacienteCreateDTO"/> que contiene los datos del paciente a crear.</param>
        /// <returns>
        /// Un objeto <see cref="PacienteDTO"/> que representa el paciente recién creado.
        /// </returns>
        /// <response code="201">El paciente ha sido creado exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="409">Si el numero de la Seguridad Social o el DNI ya están registrados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCreateDTO pacienteDTO)
        {
            // Verificar si ya existe un paciente con el mismo número de seguridad social o DNI
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            if (await _context.Pacientes.AnyAsync(p => p.Dni == pacienteDTO.Dni))
            {
                return Conflict("Ya existe un paciente con el DNI proporcionado.");
            }

            // Validar el formato del número de seguridad social
            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            // Validar formato del DNI
            if (!Regex.IsMatch(pacienteDTO.Dni, @"^\d{8}[A-Za-z]$"))
            {
                return BadRequest("El DNI debe tener 8 números seguidos de una letra.");
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
            return CreatedAtAction(nameof(GetPaciente), new { id = paciente.IdPaciente }, pacienteDTOResult);
        }

        /// <summary>
        /// Actualiza un paciente existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID del paciente que se va a actualizar.</param>
        /// <param name="pacienteDTO">El objeto <see cref="PacienteUpdateDTO"/> que contiene los datos actualizados del paciente.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="404">Si no se encuentra el paciente con el ID proporcionado.</response>
        /// <response code="409">Si el numero de la Seguridad Social o el DNI ya están registrados.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaciente(int id, PacienteUpdateDTO pacienteDTO)
        {
            var pacienteExiste = await _context.Pacientes.FindAsync(id);
            if (pacienteExiste == null) return NotFound("No se encontró el paciente especificado.");

            // Verificar si ya existe un paciente con el mismo número de seguridad social o DNI
            if (await _context.Pacientes.AnyAsync(p => p.SeguridadSocial == pacienteDTO.SeguridadSocial && p.IdPaciente != id))
            {
                return Conflict("Ya existe un paciente con el número de seguridad social proporcionado.");
            }

            if (await _context.Pacientes.AnyAsync(p => p.Dni == pacienteDTO.Dni && p.IdPaciente != id))
            {
                return Conflict("Ya existe un paciente con el DNI proporcionado.");
            }

            // Validar el formato del número de seguridad social
            if (pacienteDTO.SeguridadSocial.Length != 12 || !pacienteDTO.SeguridadSocial.All(char.IsDigit))
            {
                return BadRequest("El número de seguridad social debe tener exactamente 12 dígitos numéricos.");
            }

            // Validar formato del DNI
            if (!Regex.IsMatch(pacienteDTO.Dni, @"^\d{8}[A-Za-z]$"))
            {
                return BadRequest("El DNI debe tener 8 números seguidos de una letra.");
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
                if (!PacienteExists(id)) return NotFound("No se encontró el paciente especificado.");
                else throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Elimina un paciente específico de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID del paciente que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra el paciente con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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
