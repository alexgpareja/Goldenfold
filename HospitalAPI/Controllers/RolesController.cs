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


        /// <summary>
        /// Obtiene una lista de todos los roles disponibles.
        /// </summary>
        /// <returns>Una lista de objetos <see cref="RolDTO"/> que representan los roles.</returns>
        /// <response code="200">Retorna una lista de roles en formato DTO.</response>
        /// <response code="404">Retorna un código HTTP 404 si no se encuentran roles.</response>
        /// <response code="500">Retorna un código HTTP 500 si ocurre un error al recuperar los roles.</response>
        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDTO>>> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            var rolesDTO = _mapper.Map<IEnumerable<RolDTO>>(roles);
            return Ok(rolesDTO);
        }


        /// <summary>
        /// Obtiene un rol específico por su identificador.
        /// </summary>
        /// <param name="id">El identificador único del rol a recuperar.</param>
        /// <returns>Un objeto <see cref="RolDTO"/> que representa el rol con el identificador especificado.</returns>
        /// <response code="200">Retorna el rol en formato DTO si el rol es encontrado.</response>
        /// <response code="404">Retorna un código HTTP 404 si no se encuentra el rol con el identificador especificado.</response>
        /// <response code="500">Retorna un código HTTP 500 si ocurre un error al recuperar el rol.</response>
        // GET: api/Roles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RolDTO>> GetRolById(int id)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound();
            }

            var rolDTO = _mapper.Map<RolDTO>(rol);
            return Ok(rolDTO);
        }


        /// <summary>
        /// Obtiene una lista de roles cuyo nombre contiene la cadena proporcionada, sin importar mayúsculas o minúsculas.
        /// </summary>
        /// <param name="nombre">La cadena que se buscará en el nombre de los roles.</param>
        /// <returns>Una lista de objetos <see cref="RolDTO"/> que representan los roles cuyo nombre contiene la cadena proporcionada.</returns>
        /// <response code="200">Retorna una lista de roles en formato DTO que coinciden con el nombre proporcionado.</response>
        /// <response code="404">Retorna un código HTTP 404 si no se encuentran roles que coincidan con el nombre proporcionado.</response>
        /// <response code="500">Retorna un código HTTP 500 si ocurre un error al recuperar los roles.</response>
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

        private bool RolExists(int id)
        {
            return _context.Roles.Any(e => e.IdRol == id);
        }
    }
}