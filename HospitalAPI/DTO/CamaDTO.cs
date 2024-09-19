using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTO
{
    public class CamaDTO
    {
        [Required]
        public int IdCama { get; set; } // Refleja la clave primaria de la entidad Cama

        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "La ubicación debe tener exactamente 10 caracteres.")] // Ajuste para reflejar exactamente 10 caracteres
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string Tipo { get; set; }

        [Required]
         public int IdHabitacion { get; set; }
    }

    public class CamaCreateDTO
    {
        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(10, MinimumLength = 1, ErrorMessage = "La ubicación debe tener entre 1 y 10 caracteres.")] // Se permite entre 1 y 10 caracteres
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public EstadoCama Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public TipoCama Tipo { get; set; }

        [Required(ErrorMessage = "El ID de la habitación es obligatorio.")]
        public int IdHabitacion { get; set; } // Para reflejar la relación con la habitación
    }

    public class CamaUpdateDTO
    {
        [Required(ErrorMessage = "El ID de la cama es obligatorio.")]
        public int IdCama { get; set; } // Refleja la clave primaria de la cama

        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(10, MinimumLength = 1, ErrorMessage = "La ubicación debe tener entre 1 y 10 caracteres.")] // Mantiene la flexibilidad en la longitud
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string Tipo { get; set; }

        [Required(ErrorMessage = "El ID de la habitación es obligatorio.")]
        public int IdHabitacion { get; set; } // Para asignar la habitación correcta
    }
}
