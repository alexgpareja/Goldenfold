using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Rol
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_rol")]
        public int IdRol { get; set; }

        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre del rol no puede tener más de 50 caracteres.")]
        [Column("nombre_rol")]
        public string NombreRol { get; set; }

        // Propiedad de navegación
        public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
