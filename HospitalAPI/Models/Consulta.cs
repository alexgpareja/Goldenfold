using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Consulta
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        [Column("id_consulta")]
        public int IdConsulta { get; set; }

        [ForeignKey("Paciente")]
        [Required(ErrorMessage = "El paciente es obligatorio.")]
        [Column("id_paciente")]
        public int? IdPaciente { get; set; }

        [ForeignKey("Medico")]
        [Required(ErrorMessage = "El médico es obligatorio.")]
        [Column("id_medico")]
        public int? IdMedico { get; set; }

        [Required(ErrorMessage = "El motivo de la consulta es obligatorio.")]
        [StringLength(500, ErrorMessage = "El motivo no puede tener más de 500 caracteres.")]
        [Column("motivo")]
        public string Motivo { get; set; }

        [Required(ErrorMessage = "La fecha de solicitud es obligatoria.")]
        [Column("fecha_solicitud")]
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;

        [Column("fecha_consulta")] 
        public DateTime? FechaConsulta { get; set; }

        [Required(ErrorMessage = "El estado de la consulta es obligatorio.")]
        [Column("estado")]
        public EstadoConsulta Estado { get; set; } = EstadoConsulta.pendiente;

        // Propiedades de navegación
        public virtual Paciente Paciente { get; set; }
        public virtual Usuario Medico { get; set; }
    }

    // Enum para el estado de la consulta
    public enum EstadoConsulta
    {
        pendiente,
        completada
    }
}
