using System;
using System.ComponentModel.DataAnnotations;


namespace HospitalApi.DTO
{
    public class IngresoDTO
    {
        public int IdIngreso { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int? IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int? IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo del ingreso es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        public string Motivo { get; set; }

        public DateTime FechaSolicitud { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; } // Debería alinearse con el enum EstadoIngreso si es posible

        public int? IdAsignacion { get; set; }
    }

    public class IngresoCreateDTO
    {
        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int? IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int? IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo del ingreso es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        public string Motivo { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; }

        public int? IdAsignacion { get; set; }
    }

    public class IngresoUpdateDTO
    {
        [Required(ErrorMessage = "El ID del ingreso es obligatorio.")]
        public int IdIngreso { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo del ingreso es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        public string Motivo { get; set; }

        [Required(ErrorMessage = "La fecha de solicitud es obligatoria.")]
        public DateTime FechaSolicitud { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; }

        public int? IdAsignacion { get; set; }
    }
}
