using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

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


        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDTO>>> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            if (!roles.Any())
            {
                return NotFound("No se han encontrado roles.");
            }
            var rolesDTO = _mapper.Map<IEnumerable<RolDTO>>(roles);
            return Ok(rolesDTO);
        }


        // GET: api/Roles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RolDTO>> GetRolById(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
            {
                return NotFound("No se han encontrado ningún rol con ese ID");
            }
            var rolDTO = _mapper.Map<RolDTO>(rol);
            return Ok(rolDTO);
        }


        // GET: api/Roles/ByName/{nombre}
        [HttpGet("ByName/{nombre}")]
        public async Task<ActionResult<IEnumerable<RolDTO>>> GetRolByName(string nombre)
        {
            var roles = await _context.Roles
                .Where(u => u.NombreRol.ToLower().Contains(nombre.ToLower()))
                .ToListAsync();
            if (!roles.Any())
            {
                return NotFound("No se ha encontrado ningún rol con este nombre.");
            }
            var rolesDTO = _mapper.Map<IEnumerable<RolDTO>>(roles);
            return Ok(rolesDTO);
        }


        // POST: api/Roles
        [HttpPost]
        public async Task<ActionResult<RolDTO>> CreateRol(RolDTO rolDTO)
        {
            if (await _context.Roles.AnyAsync(r => r.NombreRol == rolDTO.NombreRol))
            {
                return Conflict("El nombre del rol ya está en uso.");
            }
            var rol = _mapper.Map<Rol>(rolDTO);
            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRolById), new { id = rol.IdRol }, rolDTO);
        }


        // PUT: api/Roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRol(int id, RolDTO rolDTO)
        {
            if (id != rolDTO.IdRol)
            {
                return BadRequest("El ID del rol proporcionado no coincide con el ID en la solicitud.");
            }
            var rolExistente = await _context.Roles.FindAsync(id);
            if (rolExistente == null)
            {
                return NotFound("No se encontró el rol especificado.");
            }
            _mapper.Map(rolDTO, rolExistente);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolExists(id))
                {
                    return NotFound("No se encontró el rol especificado.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }


        // DELETE: api/Roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
            {
                return NotFound("No se encontró el rol especificado.");
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
