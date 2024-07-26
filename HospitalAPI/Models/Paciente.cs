using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Paciente
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Required]
        [StringLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "La edad debe ser un número positivo.")]
        [Column("edad")]
        public int Edad { get; set; }

        [StringLength(255)]
        [Column("sintomas")]
        public string Sintomas { get; set; }

        [StringLength(50)]
        [Column("estado")]
        public string Estado { get; set; } = "Pendiente de Cama";

        [Column("fecha_registro")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm:ss}", ApplyFormatInEditMode = true)]
        public DateTime? FechaRegistro { get; set; } = DateTime.Now;

        [Required]
        [StringLength(12, MinimumLength = 12)]
        [Column("seguridad_social")]
        public string SeguridadSocial { get; set; }

        [StringLength(255)]
        [Column("direccion")]
        public string Direccion { get; set; }

        [StringLength(20)]
        [DataType(DataType.PhoneNumber)]
        [Column("telefono")]
        public string Telefono { get; set; }

        [StringLength(100)]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; }

        [Column("historial_medico")]
        public string HistorialMedico { get; set; }

        [Column("fecha_nacimiento")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? FechaNacimiento { get; set; }

        // Propiedades de navegación
        public ICollection<HistorialAlta> HistorialAltas { get; set; }
        public ICollection<Asignacion> Asignaciones { get; set; }
    }
}
