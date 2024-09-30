using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;
using Swashbuckle.AspNetCore.Filters;
using HospitalApi.SwaggerExamples;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public RolesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDTO>>> GetRoles(
            [FromQuery] string? nombreRol)
        {
            IQueryable<Rol> query = _context.Roles;

            if (!string.IsNullOrEmpty(nombreRol))
                query = query.Where(r => r.NombreRol.ToLower().Contains(nombreRol.ToLower()));

            var roles = await query.ToListAsync();

            var rolesDTO = _mapper.Map<IEnumerable<RolDTO>>(roles);

            return Ok(rolesDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RolDTO>> GetRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound("No se encontró ningún rol con el ID especificado.");
            }

            var rolDTO = _mapper.Map<RolDTO>(rol);
            return Ok(rolDTO);
        }

        [HttpPost]
        [ProducesResponseType(typeof(RolDTO), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        [SwaggerResponseExample(201, typeof(RolDTOExample))]
        public async Task<ActionResult<RolDTO>> CreateRol(RolCreateDTO rolDTO)
        {
            if (string.IsNullOrWhiteSpace(rolDTO.NombreRol))
            {
                return BadRequest("No es posible añadir un Rol en blanco.");
            }

            if (await _context.Roles.AnyAsync(r => r.NombreRol == rolDTO.NombreRol))
            {
                return Conflict("Ya hay un rol registrado con ese nombre. Por favor, elige un nombre diferente para el nuevo rol.");
            }

            var rol = _mapper.Map<Rol>(rolDTO);
            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();

            var rolDTOResult = _mapper.Map<RolDTO>(rol);
            return CreatedAtAction(nameof(GetRol), new { id = rolDTOResult.IdRol }, rolDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRol(int id, RolUpdateDTO rolDTO)
        {
            var rolExiste = await _context.Roles.FindAsync(id);

            if (rolExiste == null)
            {
                return NotFound("No se encontró ningún rol con el ID proporcionado.");
            }

            if (string.IsNullOrWhiteSpace(rolDTO.NombreRol))
            {
                return BadRequest("No es posible añadir un Rol en blanco.");
            }

            if (await _context.Roles.AnyAsync(r => r.IdRol != id && r.NombreRol == rolDTO.NombreRol))
            {
                return Conflict("Ya existe un rol con ese nombre. Por favor, elige un nombre diferente.");
            }

            _mapper.Map(rolDTO, rolExiste);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolExists(id))
                {
                    return NotFound("No se encontró el Rol especificado.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound("No se encontró el rol con el ID proporcionado.");
            }

            if (await _context.Usuarios.AnyAsync(u => u.IdRol == id))
            {
                return Conflict("Este rol está asignado a usuarios y no puede ser eliminado.");
            }

            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RolExists(int id)
        {
            return _context.Roles.Any(e => e.IdRol == id);
        }
    }
}
