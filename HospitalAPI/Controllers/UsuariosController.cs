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
        /// Obtiene una lista de usuarios basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="nombre">El nombre o parte del nombre del usuario a buscar. Este parámetro es opcional.</param>
        /// <param name="usuario">El nombre de usuario o parte del nombre de usuario a buscar. Este parámetro es opcional.</param>
        /// <returns>
        /// Una lista de objetos <see cref="UsuarioDTO"/> que representan los usuarios encontrados.
        /// </returns>
        /// <response code="200">Devuelve una lista de usuarios que coinciden con los parámetros de búsqueda.</response>
        /// <response code="404">Si no se encuentran usuarios que coincidan con los criterios de búsqueda proporcionados.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Usuarios
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


        /// <summary>
        /// Obtiene un usuario específico por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario que se desea obtener.</param>
        /// <returns>
        /// Un objeto <see cref="UsuarioDTO"/> que representa el usuario solicitado.
        /// </returns>
        /// <response code="200">Devuelve el usuario solicitado.</response>
        /// <response code="404">Si no se encuentra un usuario con el ID proporcionado.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        // GET: api/Usuarios/{id}
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


        /// <summary>
        /// Crea un nuevo usuario en la base de datos.
        /// </summary>
        /// <param name="usuarioDTO">El objeto <see cref="UsuarioCreateDTO"/> que contiene los datos del usuario a crear.</param>
        /// <returns>
        /// Un objeto <see cref="UsuarioDTO"/> que representa el usuario recién creado.
        /// </returns>
        /// <response code="201">El usuario ha sido creado exitosamente.</response>
        /// <response code="400">Si los datos proporcionados no son válidos.</response>
        /// <response code="409">Si el nombre de usuario ya está en uso o el rol no existe.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUser(UsuarioCreateDTO usuarioDTO)
        {
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


        /// <summary>
        /// Actualiza un usuario existente en la base de datos.
        /// </summary>
        /// <param name="id">El ID del usuario que se va a actualizar.</param>
        /// <param name="usuarioDTO">El objeto <see cref="UsuarioDTO"/> que contiene los datos actualizados del usuario.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización fue exitosa y no hay contenido que devolver.</response>
        /// <response code="400">Si el ID proporcionado en la URL no coincide con el ID del usuario en el cuerpo de la solicitud.</response>
        /// <response code="404">Si no se encuentra el usuario con el ID proporcionado.</response>
        /// <response code="409">Si el nombre de usuario proporcionado ya está en uso por otro usuario o si el rol no existe.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
        // PUT: api/Usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, UsuarioUpdateDTO usuarioDTO)
        {
            
            var usuarioExiste = await _context.Usuarios.FindAsync(id);

            if (usuarioExiste == null)
            {
                return NotFound("No se encontró ningun usuario con el ID proporcionado.");
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


        /// <summary>
        /// Elimina un usuario específico de la base de datos por su ID.
        /// </summary>
        /// <param name="id">El ID del usuario que se desea eliminar.</param>
        /// <returns>
        /// Un código de estado HTTP que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación fue exitosa y no hay contenido que devolver.</response>
        /// <response code="404">Si no se encuentra el usuario con el ID proporcionado.</response>
        /// <response code="500">Si ocurre un error en el servidor al procesar la solicitud.</response>
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