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

        [ForeignKey("Paciente")]
        [Column("id_paciente")]
        public int? IdPaciente { get; set; }

        [ForeignKey("Medico")]
        [Column("id_medico")]
        public int? IdMedico { get; set; }

        [Column("motivo")]
        public string Motivo { get; set; }

        [Column("fecha_solicitud")]
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;

        [Column("estado")]
        public string Estado { get; set; } = "pendiente";

        [ForeignKey("Asignacion")]
        [Column("id_asignacion")]
        public int? IdAsignacion { get; set; }

        // Propiedades de navegación
        public virtual Paciente Paciente { get; set; }
        public virtual Usuario Medico { get; set; }
        public virtual Asignacion Asignacion { get; set; }
    }
}
