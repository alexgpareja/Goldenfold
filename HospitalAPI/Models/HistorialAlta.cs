using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi;

public class HistorialAlta
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id_historial")]
    public int IdHistorial { get; set; }

    [ForeignKey("Paciente")]
    [Column("id_paciente")]
    public int IdPaciente { get; set; }

    [Required]
    [Column("fecha_alta")]
    public DateTime FechaAlta { get; set; } = DateTime.Now;

    [StringLength(255)]
    [Column("diagnostico")]
    public string Diagnostico { get; set; }

    [StringLength(255)]
    [Column("tratamiento")]
    public string Tratamiento { get; set; }

    // Propiedad de navegación
    public Paciente Paciente { get; set; }

}