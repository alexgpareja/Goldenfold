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
        public string Estado { get; set; }
        public int? IdAsignacion { get; set; }
    }

    public class IngresoCreateDTO
    {
        public int? IdPaciente { get; set; }
        public int? IdMedico { get; set; }
        public string Motivo { get; set; }
        public string Estado { get; set; }
        public int? IdAsignacion { get; set; }
    }

    public class IngresoUpdateDTO
{
    public int IdIngreso { get; set; }  // Asegúrate de que esta propiedad exista
    public int IdPaciente { get; set; }
    public int IdMedico { get; set; }
    public string Motivo { get; set; }
    public DateTime FechaSolicitud { get; set; }
    public string Estado { get; set; }
}

}
