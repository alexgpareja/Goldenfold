using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class HistorialAlta
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_historial")]
        public int IdHistorial { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        [ForeignKey("Paciente")]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "La fecha de alta es obligatoria.")]
        [Column("fecha_alta")]
        public DateTime FechaAlta { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "El diagnóstico es obligatorio.")]
        [StringLength(255, ErrorMessage = "El diagnóstico no puede tener más de 255 caracteres.")]
        [Column("diagnostico")]
        public string Diagnostico { get; set; }

        [Required(ErrorMessage = "El tratamiento es obligatorio.")]
        [StringLength(255, ErrorMessage = "El tratamiento no puede tener más de 255 caracteres.")]
        [Column("tratamiento")]
        public string Tratamiento { get; set; }

        [ForeignKey("Medico")]
        [Column("id_medico")]
        public int IdMedico { get; set; }
        public Usuario Medico { get; set; }
        public virtual Paciente Paciente { get; set; }
    }
}
