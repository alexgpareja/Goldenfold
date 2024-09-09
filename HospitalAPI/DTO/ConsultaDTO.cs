using System;

namespace HospitalApi.DTO
{
    public class ConsultaDTO
    {
        public int IdConsulta { get; set; }
        public int? IdPaciente { get; set; }
        public int? IdMedico { get; set; }
        public string Motivo { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime? FechaConsulta { get; set; }
        public string Estado { get; set; }
    }

    public class ConsultaCreateDTO
    {
        public int? IdPaciente { get; set; }
        public int? IdMedico { get; set; }
        public string Motivo { get; set; }
        public DateTime? FechaConsulta { get; set; }
        public string Estado { get; set; }
    }

    public class ConsultaUpdateDTO
{
    public int IdConsulta { get; set; }  // Asegúrate de que esta propiedad exista
    public int IdPaciente { get; set; }
    public int IdMedico { get; set; }
    public string Motivo { get; set; }
    public DateTime FechaConsulta { get; set; }
    public string Estado { get; set; }
}

}
