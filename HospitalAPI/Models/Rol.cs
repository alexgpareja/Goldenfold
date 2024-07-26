using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;
public class Rol
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdRol { get; set; }

    [Required]
    [StringLength(50)]
    public string NombreRol { get; set; }

    // Propiedad de navegaci�n
    public ICollection<Usuario> Usuarios { get; set; }

}