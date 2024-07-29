using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;
public class Usuario
{ 
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Required]
    [StringLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre_usuario")]
    public string NombreUsuario { get; set; }

    [Required]
    [StringLength(255)]
    [Column("contrasenya")]
    public string Contrasenya { get; set; }

    [ForeignKey("Rol")]
    [Column("id_rol")]
    public int IdRol { get; set; }

    // Propiedades de navegación
    public Rol Rol { get; set; }
    public ICollection<Asignacion> Asignaciones { get; set; }

}