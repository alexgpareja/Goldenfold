using HospitalApi.DTO;
using HospitalApi.Models;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace HospitalApi.Services
{
    public class AsignacionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AsignacionService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Obtener todas las asignaciones con filtros opcionales
        public async Task<IEnumerable<AsignacionDTO>> GetAsignacionesAsync(
            int? idPaciente, int? idCama, DateTime? fechaAsignacion, DateTime? fechaLiberacion, int? asignadoPor)
        {
            IQueryable<Asignacion> query = _context.Asignaciones;

            if (idPaciente.HasValue)
                query = query.Where(a => a.IdPaciente == idPaciente.Value);

            if (idCama.HasValue)
                query = query.Where(a => a.IdCama == idCama.Value);

            if (fechaAsignacion.HasValue)
                query = query.Where(a => a.FechaAsignacion.Date == fechaAsignacion.Value.Date);

            if (fechaLiberacion.HasValue)
                query = query.Where(a => a.FechaLiberacion.Value.Date == fechaLiberacion.Value.Date);

            if (asignadoPor.HasValue)
                query = query.Where(a => a.AsignadoPor == asignadoPor.Value);

            var asignaciones = await query.ToListAsync();
            return _mapper.Map<IEnumerable<AsignacionDTO>>(asignaciones);
        }

        // Obtener una asignación por ID
        public async Task<AsignacionDTO?> GetAsignacionByIdAsync(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            return asignacion == null ? null : _mapper.Map<AsignacionDTO>(asignacion);
        }

        // Crear una nueva asignación
        public async Task<AsignacionDTO> CreateAsignacionAsync(AsignacionCreateDTO asignacionDTO)
        {
            var asignacion = _mapper.Map<Asignacion>(asignacionDTO);
            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();

            var ingreso = await _context.Ingresos
                .FirstOrDefaultAsync(i => i.IdPaciente == asignacionDTO.IdPaciente && i.Estado == EstadoIngreso.Pendiente);

            if (ingreso != null)
            {
                ingreso.Estado = EstadoIngreso.Ingresado;
                ingreso.IdAsignacion = asignacion.IdAsignacion;
                ingreso.FechaIngreso = DateTime.Now;
                _context.Ingresos.Update(ingreso);
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<AsignacionDTO>(asignacion);
        }

        // Actualizar una asignación existente
        public async Task<bool> UpdateAsignacionAsync(int id, AsignacionUpdateDTO asignacionDTO)
        {
            var asignacionExiste = await _context.Asignaciones.FindAsync(id);
            if (asignacionExiste == null)
                return false;

            _mapper.Map(asignacionDTO, asignacionExiste);

            if (asignacionDTO.FechaLiberacion.HasValue)
            {
                var cama = await _context.Camas.FindAsync(asignacionDTO.IdCama);
                if (cama != null)
                {
                    cama.Estado = EstadoCama.Disponible;
                    _context.Camas.Update(cama);
                }

                var paciente = await _context.Pacientes.FindAsync(asignacionDTO.IdPaciente);
                if (paciente != null)
                {
                    paciente.Estado = EstadoPaciente.Alta;
                    _context.Pacientes.Update(paciente);
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Eliminar una asignación
        public async Task<bool> DeleteAsignacionAsync(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
                return false;

            _context.Asignaciones.Remove(asignacion);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
