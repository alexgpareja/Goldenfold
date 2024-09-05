using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
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


        /// <summary>
        /// Obtiene una lista de todos los roles disponibles.
        /// </summary>
        /// <returns>Una lista de objetos <see cref="RolDTO"/> que representan los roles.</returns>
        /// <response code="200">Retorna una lista de roles en formato DTO.</response>
        /// <response code="404">Retorna un código HTTP 404 si no se encuentran roles.</response>
        /// <response code="500">Retorna un código HTTP 500 si ocurre un error al recuperar los roles.</response>
        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolDTO>>> GetRoles([FromQuery] string? nombreRol)
        {
            IQueryable<Rol> query = _context.Roles;
            if (!nombreRol.IsNullOrEmpty()) query = query.Where(r => r.NombreRol.Contains(nombreRol!.ToLower()));
            var roles = await query.ToListAsync();
            if (!roles.Any())
            {
                return NotFound("No se han encontrado roles que coincidan con los criterios de búsqueda proporcionados.");
            }
            var rolesDTO = _mapper.Map<IEnumerable<RolDTO>>(roles);
            return Ok(rolesDTO);
        }


        /// <summary>
        /// Obtiene un rol específico por su identificador.
        /// </summary>
        /// <param name="id" example="5">El identificador único del rol a recuperar.</param>
        /// <returns>Un objeto <see cref="RolDTO"/> que representa el rol con el identificador especificado.</returns>
        /// <response code="200">Retorna el rol en formato DTO si el rol es encontrado.</response>
        /// <response code="404">Retorna un código HTTP 404 si no se encuentra el rol con el identificador especificado.</response>
        /// <response code="500">Retorna un código HTTP 500 si ocurre un error al recuperar el rol.</response>
        // GET: api/Roles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RolDTO>> GetRol(int id)
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
        /// Crea un nuevo rol en el sistema.
        /// </summary>
        /// <param name="rolDTO">El objeto <see cref="RolCreateDTO"/> que contiene los datos del rol a crear.</param>
        /// <returns>
        /// Un <see cref="ActionResult{RolDTO}"/> que contiene el rol creado.
        /// </returns>
        /// <response code="201">Indica que el rol se ha creado correctamente.</response>
        /// <response code="400">Indica que la solicitud es incorrecta.</response>
        /// <response code="409">Indica que ya existe un rol con el mismo nombre.</response>
        /// <response code="500">Si se produce un error en el servidor al procesar la solicitud.</response>
        [HttpPost]
        [ProducesResponseType(typeof(RolDTO), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        [ProducesResponseType(500)]
        [SwaggerResponseExample(201, typeof(RolDTOExample))]
        public async Task<ActionResult<RolDTO>> CreateRol(RolCreateDTO rolDTO)
        {
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


        /// <summary>
        /// Actualiza un rol existente en el sistema.
        /// </summary>
        /// <param name="id">El ID del rol que se va a actualizar.</param>
        /// <param name="rolDTO">El objeto <see cref="RolUpdateDTO"/> que contiene los datos actualizados del rol.</param>
        /// <returns>
        /// Un <see cref="IActionResult"/> que indica el resultado de la operación de actualización.
        /// </returns>
        /// <response code="204">Indica que la actualización se realizó correctamente.</response>
        /// <response code="404">Indica que no se encontró ningún rol con el ID proporcionado.</response>
        /// <response code="409">Indica que ya existe otro rol con el mismo nombre.</response>
        /// <response code="500">Indica que ocurrió un error al actualizar el rol en la base de datos.</response>
        // PUT: api/Roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRol(int id, RolUpdateDTO rolDTO)
        {
            var rolExiste = await _context.Roles.FindAsync(id);

            if (rolExiste == null)
            {
                return NotFound("No se encontró ningún rol con el ID proporcionado.");
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

        /// <summary>
        /// Elimina un rol existente en el sistema.
        /// </summary>
        /// <param name="id">El ID del rol que se va a eliminar.</param>
        /// <returns>
        /// Un <see cref="IActionResult"/> que indica el resultado de la operación de eliminación.
        /// </returns>
        /// <response code="204">Indica que la eliminación se realizó correctamente.</response>
        /// <response code="404">Indica que no se encontró ningún rol con el ID proporcionado.</response>
        /// <response code="500">Indica que ocurrió un error al actualizar el rol en la base de datos.</response>
        // DELETE: api/Roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            var rol = await _context.Roles.FindAsync(id);

            if (rol == null)
            {
                return NotFound("No se encontró el rol con el ID proporcionado.");
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