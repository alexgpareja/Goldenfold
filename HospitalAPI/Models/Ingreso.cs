using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Ingreso
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        [Column("id_ingreso")]
        public int IdIngreso { get; set; }

        [Required(ErrorMessage = "El paciente es obligatorio.")]
        [ForeignKey("Paciente")]
        [Column("id_paciente")]
        public int? IdPaciente { get; set; }

        [Required(ErrorMessage = "El médico es obligatorio.")]
        [ForeignKey("Medico")]
        [Column("id_medico")]
        public int? IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo del ingreso es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        [Column("motivo")]
        public string Motivo { get; set; }

        [Required(ErrorMessage = "La fecha de solicitud es obligatoria.")]
        [Column("fecha_solicitud")]
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "La fecha de ingreso es obligatoria.")]
        [Column("fecha_ingreso")]
        public DateTime? FechaIngreso { get; set; } 

        [Required(ErrorMessage = "El estado del ingreso es obligatorio.")]
        [Column("estado")]
        public EstadoIngreso Estado { get; set; } = EstadoIngreso.Pendiente;

        [ForeignKey("Asignacion")] 
        [Column("id_asignacion")]
        public int? IdAsignacion { get; set; }

        // Propiedades de navegación
        public virtual Paciente Paciente { get; set; }
        public virtual Usuario Medico { get; set; }
        public virtual Asignacion Asignacion { get; set; }
    }

    // Enum para el estado del ingreso
    public enum EstadoIngreso
    {
        Pendiente,
        Ingresado,
        Rechazado
    }
}
