using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UsuariosController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            if (!usuarios.Any())
            {
                return NotFound("No se han encontrado usuarios.");
            }
            var usuariosDTO = _mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
            return Ok(usuariosDTO);
        }

        // GET: api/Usuarios/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuarioById(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound("No se ha encontrado ningún usuario con este ID.");
            }
            var usuarioDTO = _mapper.Map<UsuarioDTO>(usuario);
            return Ok(usuarioDTO);
        }

        // GET: api/Usuarios/ByName/{nombre}
        [HttpGet("ByName/{nombre}")]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarioByName(string nombre)
        {
            var usuarios = await _context.Usuarios
                .Where(u => u.NombreUsuario.Contains(nombre.ToLower()))
                .ToListAsync();
            if (!usuarios.Any())
            {
                return NotFound("No se ha encontrado ningún usuario con este nombre.");
            }
            var usuariosDTO = _mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
            return Ok(usuariosDTO);
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUsuario(UsuarioDTO usuarioDTO)
        {
            if (await _context.Usuarios.AnyAsync(u => u.NombreUsuario == usuarioDTO.NombreUsuario))
            {
                return Conflict("El nombre de usuario ya está en uso.");
            }

            if (!await _context.Roles.AnyAsync(r => r.IdRol == usuarioDTO.IdRol))
            {
                return Conflict("El rol no existe.");
            }
            var usuario = _mapper.Map<Usuario>(usuarioDTO);
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            var usuarioDTOResult = _mapper.Map<UsuarioDTO>(usuario);
            return CreatedAtAction(nameof(GetUsuarioById), new { id = usuario.IdUsuario }, usuarioDTOResult);
        }

        // PUT: api/Usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, UsuarioDTO usuarioDTO)
        {
            if (id != usuarioDTO.IdUsuario)
            {
                return BadRequest("El ID del usuario proporcionado no coincide con el ID en la solicitud.");
            }
            var usuarioExiste = await _context.Usuarios.FindAsync(id);
            if (usuarioExiste == null)
            {
                return NotFound("No se encontró el usuario especificado.");
            }
            if (await _context.Usuarios.AnyAsync(u => u.IdUsuario != id && u.NombreUsuario == usuarioDTO.NombreUsuario))
            {
                return Conflict("El nombre de usuario ya está en uso.");
            }
            _mapper.Map(usuarioDTO, usuarioExiste);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound("No se encontró el usuario especificado.");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/Usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("No se encontró el usuario especificado.");
            }
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
