using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalApi.Models;
using HospitalApi.DTO;
using AutoMapper;

namespace HospitalApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CamasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CamasController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// Obtiene una lista de camas basada en los parámetros de búsqueda opcionales.
        /// </summary>
        /// <param name="ubicacion">La ubicación de la cama a buscar. Este parámetro es opcional.</param>
        /// <param name="estado">El estado de la cama a buscar. Este parámetro es opcional.</param>
        /// <param name="tipo">El tipo de la cama a buscar. Este parámetro es opcional.</param>
        /// <returns>Una lista de objetos <see cref="CamaDTO"/> que representan las camas encontradas.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CamaDTO>>> GetCamas([FromQuery] string? ubicacion, [FromQuery] string? estado, [FromQuery] string? tipo)
        {
            IQueryable<Cama> query = _context.Camas;

            if (!string.IsNullOrEmpty(ubicacion))
                query = query.Where(c => c.Ubicacion.ToLower().Contains(ubicacion.ToLower()));

            // Verificar si estado es un enum o string
            if (!string.IsNullOrEmpty(estado))
            {
                if (Enum.TryParse(typeof(EstadoCama), estado, true, out var estadoEnum))
                {
                    query = query.Where(c => c.Estado == (EstadoCama)estadoEnum);
                }
                else
                {
                    return BadRequest("El valor de estado no es válido.");
                }
            }

            // Verificar si tipo es un enum o string
            if (!string.IsNullOrEmpty(tipo))
            {
                if (Enum.TryParse(typeof(TipoCama), tipo, true, out var tipoEnum))
                {
                    query = query.Where(c => c.Tipo == (TipoCama)tipoEnum);
                }
                else
                {
                    return BadRequest("El valor de tipo no es válido.");
                }
            }

            var camas = await query.ToListAsync();

            var camasDTO = _mapper.Map<IEnumerable<CamaDTO>>(camas);
            return Ok(camasDTO);
        }

        /// <summary>
        /// Obtiene una cama específica por su ID.
        /// </summary>
        /// <param name="idCama">El ID de la cama que se desea obtener.</param>
        /// <returns>Un objeto <see cref="CamaDTO"/> que representa la cama solicitada.</returns>
        [HttpGet("{idCama}")]
        public async Task<ActionResult<CamaDTO>> GetCamaById(int idCama)
        {
            var cama = await _context.Camas.FindAsync(idCama);

            if (cama == null)
            {
                return NotFound("No se ha encontrado ninguna cama con este ID.");
            }

            var camaDTO = _mapper.Map<CamaDTO>(cama);
            return Ok(camaDTO);
        }

        /// <summary>
        /// Crea una nueva cama en la base de datos.
        /// </summary>
        /// <param name="camaDTO">El objeto <see cref="CamaCreateDTO"/> que contiene los datos de la cama a crear.</param>
        /// <returns>Un objeto <see cref="CamaDTO"/> que representa la cama recién creada.</returns>
        [HttpPost]
        public async Task<ActionResult<CamaDTO>> CreateCama(CamaCreateDTO camaDTO)
        {
            if (await _context.Camas.AnyAsync(c => c.Ubicacion == camaDTO.Ubicacion))
            {
                return Conflict("La ubicación de la cama ya está en uso.");
            }

            var cama = _mapper.Map<Cama>(camaDTO);
            _context.Camas.Add(cama);
            await _context.SaveChangesAsync();

            var camaDTOResult = _mapper.Map<CamaDTO>(cama);
            return CreatedAtAction(nameof(GetCamaById), new { idCama = camaDTOResult.IdCama }, camaDTOResult);
        }

        // Se eliminan los métodos para editar y eliminar camas, ya que estas operaciones no están permitidas.
    }
}
