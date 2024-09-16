using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Cama
    {
        [Key]
        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "La ubicación debe tener exactamente 8 caracteres.")]
        [Column("Ubicacion")]
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        [Column("estado")]
        public EstadoCama Estado { get; set; } = EstadoCama.Disponible;

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        [Column("tipo")]
        public TipoCama Tipo { get; set; }

        // Relación con la clase Habitacion
        [ForeignKey("Habitacion")]
        [Column("id_habitacion")]
        public int IdHabitacion { get; set; }

        public Habitacion Habitacion { get; set; }

        // Propiedad de navegación
        public ICollection<Asignacion> Asignaciones { get; set; }

        // Constructor
        public Cama()
        {
            Asignaciones = new List<Asignacion>();
        }
    }

    // Enum para el estado de la cama
    public enum EstadoCama
    {
        Disponible,
        NoDisponible
    }

    // Enum para el tipo de cama
    public enum TipoCama
    {
        General,
        UCI,
        Postoperatorio
    }
}
