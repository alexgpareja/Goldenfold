using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTO
{
    // DTO para lectura y listado de Ingresos
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

        public DateTime? FechaIngreso { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string TipoCama { get; set; }

        public int? IdAsignacion { get; set; }
    }

    // DTO para la creación de un ingreso
    public class IngresoCreateDTO
    {
        public int IdIngreso { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int? IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int? IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo del ingreso es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        public string Motivo { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public EstadoIngreso Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public TipoCama TipoCama { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public DateTime? FechaIngreso { get; set; }

        public int? IdAsignacion { get; set; }
    }

    // DTO para actualizar un ingreso
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

        public DateTime? FechaIngreso { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public TipoCama TipoCama { get; set; }

        public int? IdAsignacion { get; set; }
    }
}
