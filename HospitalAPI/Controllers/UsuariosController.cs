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


        /// <summary>
        /// Obtiene la lista de todos los usuarios.
        /// </summary>
        /// <returns>
        /// Una lista de objetos <see cref="UsuarioDTO"/> que representan los usuarios.
        /// </returns>
        /// <response code="200">Devuelve la lista de usuarios.</response>
        /// <response code="404">Si no se encuentra ningún usuario.</response>
        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios([FromQuery] string? nombre)
        {
            IQueryable<Usuario> query = _context.Usuarios;
            if (!nombre.IsNullOrEmpty()) query = query.Where(u => u.NombreUsuario.Contains(nombre!.ToLower()));
            var usuarios = await query.ToListAsync();
            if (!usuarios.Any())
            {
                return NotFound("No se han encontrado usuarios.");
            }
            var usuariosDTO = _mapper.Map<IEnumerable<UsuarioDTO>>(usuarios);
            return Ok(usuariosDTO);
        }


        /// <summary>
        /// Obtiene un usuario por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="UsuarioDTO"/> que representa el usuario solicitado.
        /// </returns>
        /// <response code="200">Devuelve el usuario solicitado.</response>
        /// <response code="404">Si no se encuentra un usuario con el ID proporcionado.</response>
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


        /// <summary>
        /// Obtiene una lista de usuarios cuyo nombre de usuario contiene el nombre especificado.
        /// </summary>
        /// <param name="nombre">El nombre o parte del nombre del usuario que se desea buscar.</param>
        /// <returns>
        /// Una colección de objetos <see cref="UsuarioDTO"/> que representan los usuarios cuyos nombres coinciden con la búsqueda.
        /// </returns>
        /// <response code="200">Devuelve una lista de usuarios coincidentes.</response>
        /// <response code="404">Si no se encuentra ningún usuario con el nombre proporcionado.</response>
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


        /// <summary>
        /// Crea un nuevo usuario.
        /// </summary>
        /// <param name="usuarioDTO">Datos del usuario a crear.</param>
        /// <returns>El usuario creado.</returns>
        /// <response code="201">El usuario se ha creado correctamente.</response>
        /// <response code="409">Se ha producido un error.</response>
        /// <response code="400">Solicitud incorrecta.</response>
        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUser(UsuarioCreateDTO usuarioDTO)
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
            return CreatedAtAction(nameof(GetUsuarioById), new { id = usuarioDTOResult.IdUsuario }, usuarioDTOResult);
        }



        /// <summary>
        /// Actualiza un usuario existente basado en el nombre de usuario proporcionado.
        /// </summary>
        /// <param name="nombre">El nombre del usuario que se va a actualizar.</param>
        /// <param name="usuarioDTO">El objeto <see cref="UsuarioDTO"/> con los datos actualizados del usuario.</param>
        /// <returns>Una respuesta HTTP que indica el resultado de la operación de actualización.</returns>
        /// <response code="204">Retorna un código HTTP 204 (No Content) si la actualización del usuario fue exitosa.</response>
        /// <response code="400">Retorna un código HTTP 400 (Bad Request) si el nombre del usuario en el objeto DTO no coincide con el nombre del usuario especificado en la URL.</response>
        /// <response code="404">Retorna un código HTTP 404 (Not Found) si no se encuentra un usuario con el nombre proporcionado.</response>
        /// <response code="409">Retorna un código HTTP 409 (Conflict) si el nombre de usuario proporcionado en el DTO ya está en uso.</response>
        /// <response code="500">Retorna un código HTTP 500 (Internal Server Error) si ocurre un error al actualizar el usuario en la base de datos.</response>
        // PUT: api/Usuarios/{nombre}
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

            if (!await _context.Roles.AnyAsync(r => r.IdRol == usuarioDTO.IdRol))
            {
                return Conflict("El rol no existe.");
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


        /// <summary>
        /// Elimina un usuario específico por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario que se desea eliminar.</param>
        /// <returns>Un resultado de la acción que indica el resultado de la operación.</returns>
        /// <response code="204">Indica que la eliminación del usuario se realizó correctamente.</response>
        /// <response code="404">Si no se encuentra el usuario especificado.</response>
        /// <response code="500">Si ocurre un error al eliminar el usuario.</response>
        // DELETE: api/Usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserById(int id)
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


        /// <summary>
        /// Elimina un usuario específico por su nombre de usuario.
        /// </summary>
        /// <param name="nombre">El nombre de usuario del usuario que se desea eliminar.</param>
        /// <returns>Un resultado de la acción que indica el resultado de la operación.</returns>
        /// <response code="204">Indica que la eliminación del usuario se realizó correctamente.</response>
        /// <response code="404">Si no se encuentra el usuario especificado.</response>
        /// <response code="500">Si ocurre un error al eliminar el usuario.</response>
        // DELETE: api/Usuarios/ByName/{nombre}
        [HttpDelete("ByName/{nombre}")]
        public async Task<IActionResult> DeleteUserByName(string nombre)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.NombreUsuario == nombre);

            if (usuario == null)
            {
                return NotFound("No se ha encontrado este usuario. Asegúrate de que el nombre de usuario es correcto.");
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