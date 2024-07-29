using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;

public class Habitacion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id_habitacion")]
    public int IdHabitacion { get; set; }

    [Required]
    [StringLength(2)]
    [Column("edificio")]
    public string Edificio { get; set; }

    [Required]
    [StringLength(2)]
    [Column("planta")]
    public string Planta { get; set; }

    [Required]
    [StringLength(2)]
    [Column("numero_habitacion")]
    public string NumeroHabitacion { get; set; }
}