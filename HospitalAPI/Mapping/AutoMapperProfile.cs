using AutoMapper;
using HospitalApi.Models;
using HospitalApi.DTO;
using HospitalApi;

namespace HospitalApi.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Paciente mappings
            CreateMap<Paciente, PacienteDTO>().ReverseMap();
            CreateMap<PacienteCreateDTO, Paciente>().ReverseMap();

            // Cama mappings
            CreateMap<Cama, CamaDTO>().ReverseMap();

            // Habitacion mappings
            CreateMap<Habitacion, HabitacionDTO>().ReverseMap();

            // Asignacion mappings
            CreateMap<Asignacion, AsignacionDTO>().ReverseMap();

            // HistorialAlta mappings
            CreateMap<HistorialAlta, HistorialAltaDTO>().ReverseMap();

            // Usuario mappings
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<UsuarioCreateDTO, Usuario>().ReverseMap();

            // Rol mappings
            CreateMap<Rol, RolDTO>().ReverseMap();
        }
    }
}
