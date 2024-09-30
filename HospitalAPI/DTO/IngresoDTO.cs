using System;
namespace HospitalApi.DTO
{
    public class IngresoDTO
    {
        public int IdIngreso { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdMedico { get; set; }
        public string Motivo { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string Estado { get; set; }
        public string TipoCama { get; set; }
        public int? IdAsignacion { get; set; }
    }

    // DTO para la creación de un ingreso
    public class IngresoCreateDTO
    {
        public int IdIngreso { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdMedico { get; set; }
        public string Motivo { get; set; }
        public EstadoIngreso Estado { get; set; }
        public TipoCama TipoCama { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public int? IdAsignacion { get; set; }
    }

    // DTO para actualizar un ingreso
    public class IngresoUpdateDTO
    {
        public int IdIngreso { get; set; }
        public int IdPaciente { get; set; }
        public int IdMedico { get; set; }
        public string Motivo { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime? FechaIngreso { get; set; }
        public string Estado { get; set; }
        public TipoCama TipoCama { get; set; }
        public int? IdAsignacion { get; set; }
    }
}
