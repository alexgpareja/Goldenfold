using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;
public class Cama
{
    [Key]
    [StringLength(10)]
    [Column("Ubicacion")]
    public string Ubicacion { get; set; }

    [Required]
    [StringLength(50)]
    [Column("estado")]
    public String Estado { get; set; } = "Disponible";

    [Required]
    [StringLength(50)]
    [Column("tipo")]
    public String Tipo { get; set; }

    // Propiedad de navegación
    public ICollection<Asignacion> Asignaciones { get; set; }

} 