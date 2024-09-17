using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Usuario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre de usuario no puede tener más de 50 caracteres.")]
        [Column("nombre_usuario")]
        public string NombreUsuario { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [StringLength(255, ErrorMessage = "La contraseña no puede tener más de 255 caracteres.")]
        [Column("contrasenya")]
        public string Contrasenya { get; set; }

        [Required(ErrorMessage = "El rol es obligatorio.")]
        [ForeignKey("Rol")]
        [Column("id_rol")]
        public int IdRol { get; set; }

        // Relación con HistorialAlta
        public ICollection<HistorialAlta> HistorialAltas { get; set; }

        // Propiedades de navegación
        public virtual Rol Rol { get; set; }
        public ICollection<Asignacion> Asignaciones { get; set; } = new List<Asignacion>();
        public ICollection<Consulta> Consultas { get; set; } = new List<Consulta>();
        public ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();

        public Usuario()
        {
            Consultas = new List<Consulta>();
            Ingresos = new List<Ingreso>();
        }
    }
}
