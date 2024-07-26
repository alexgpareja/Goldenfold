using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;
public class Rol
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [Required]
    [StringLength(50)]
<<<<<<< HEAD
    public string NombreRol { get; set; }
=======
    [Column("nombre_rol")]
    public RoleType NombreRol { get; set; }
>>>>>>> 053719dc872c7b4b22137d66036e4b2d90204d03

    // Propiedad de navegaci�n
    public ICollection<Usuario> Usuarios { get; set; }

}