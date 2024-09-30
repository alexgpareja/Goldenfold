using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios([FromQuery] string? nombre, [FromQuery] string? usuario)
        {
            IQueryable<Usuario> query = _context.Usuarios;
            if (!nombre.IsNullOrEmpty()) query = query.Where(u => u.Nombre.Contains(nombre!.ToLower()));
            if (!usuario.IsNullOrEmpty()) query = query.Where(u => u.NombreUsuario.Contains(usuario!.ToLower()));

            var usuarios = await query.ToListAsync();
            if (!usuarios.Any())
            {
                return NotFound("No se han encontrado usuarios que coincidan con los criterios de búsqueda proporcionados.");
            }

            var usuariosDTO = _mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
            return Ok(usuariosDTO);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound($"No se ha encontrado ningún usuario con el ID {id}.");
            }
            var usuarioDTO = _mapper.Map<UsuarioDTO>(usuario);
            return Ok(usuarioDTO);
        }

        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUser(UsuarioCreateDTO usuarioDTO)
        {
            if (string.IsNullOrWhiteSpace(usuarioDTO.Nombre) || usuarioDTO.Nombre.Split(' ').Length < 2)
            {
                return BadRequest("Mínimo nombre y un apellido.");
            }

            if (string.IsNullOrWhiteSpace(usuarioDTO.NombreUsuario))
            {
                return BadRequest("El nombre de usuario no puede estar en blanco.");
            }

            if (string.IsNullOrWhiteSpace(usuarioDTO.Contrasenya))
            {
                return BadRequest("La contraseña no puede estar en blanco.");
            }

            if (await _context.Usuarios.AnyAsync(u => u.NombreUsuario == usuarioDTO.NombreUsuario))
            {
                return Conflict("El nombre de usuario ya está en uso. Por favor, elige un nombre de usuario diferente.");
            }

            if (!await _context.Roles.AnyAsync(r => r.IdRol == usuarioDTO.IdRol))
            {
                return Conflict("El rol proporcionado no existe. Por favor, selecciona un rol válido.");
            }

            var usuario = _mapper.Map<Usuario>(usuarioDTO);
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var usuarioDTOResult = _mapper.Map<UsuarioDTO>(usuario);
            return CreatedAtAction(nameof(GetUsuario), new { id = usuarioDTOResult.IdUsuario }, usuarioDTOResult);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, UsuarioUpdateDTO usuarioDTO)
        {
            var usuarioExiste = await _context.Usuarios.FindAsync(id);
            if (usuarioExiste == null)
            {
                return NotFound("No se encontró ningun usuario con el ID proporcionado.");
            }

            if (string.IsNullOrWhiteSpace(usuarioDTO.Nombre) || usuarioDTO.Nombre.Split(' ').Length < 2)
            {
                return BadRequest("Mínimo nombre y un apellido.");
            }

            if (string.IsNullOrWhiteSpace(usuarioDTO.NombreUsuario))
            {
                return BadRequest("El nombre de usuario no puede estar en blanco.");
            }

            if (string.IsNullOrWhiteSpace(usuarioDTO.Contrasenya))
            {
                return BadRequest("La contraseña no puede estar en blanco.");
            }

            if (await _context.Usuarios.AnyAsync(u => u.IdUsuario != id && u.NombreUsuario == usuarioDTO.NombreUsuario))
            {
                return Conflict("El nombre de usuario ya está en uso por otro usuario. Por favor, elige un nombre diferente.");
            }

            if (!await _context.Roles.AnyAsync(r => r.IdRol == usuarioDTO.IdRol))
            {
                return Conflict("El rol proporcionado no existe. Por favor, selecciona un rol válido.");
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("No se encontró el usuario con el ID proporcionado.");
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
