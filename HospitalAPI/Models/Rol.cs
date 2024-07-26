using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;

public enum RoleType
{
    Administrativo = 1,
    Medico = 2,
    ControladorCamas = 3,
    AdministradorSistemas = 4
}
public class Rol
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id_rol")]
    public int IdRol { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre_rol")]
    public RoleType NombreRol { get; set; }

    // Propiedad de navegaci�n
    public ICollection<Usuario> Usuarios { get; set; }

}