using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;

public enum EstadoCama
{
    Disponible,
    Ocupado,
    EnLimpieza
}

public enum TipoCama
{
    General,
    UCI,
    Postoperatorio
}

public class Cama
{
    [Key]
    [StringLength(10)]
    [Column("ubicacion")]
    public string Ubicacion { get; set; }

    [Required]
    [StringLength(50)]
    [Column("estado")]
    public EstadoCama Estado { get; set; } = EstadoCama.Disponible;

    [Required]
    [StringLength(50)]
    [Column("tipo")]
    public TipoCama Tipo { get; set; }

    // Propiedad de navegación
    public ICollection<Asignacion> Asignaciones { get; set; }

}