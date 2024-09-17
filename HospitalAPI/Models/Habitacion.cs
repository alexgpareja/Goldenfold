using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Habitacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_habitacion")]
        public int IdHabitacion { get; set; }

        [Required(ErrorMessage = "El edificio es obligatorio.")]
        [StringLength(2, MinimumLength = 1, ErrorMessage = "El código del edificio debe tener entre 1 y 2 caracteres.")]
        [Column("edificio")]
        public string Edificio { get; set; }

        [Required(ErrorMessage = "La planta es obligatoria.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "La planta debe ser un número de 1 o 2 dígitos.")]
        [StringLength(2, MinimumLength = 1, ErrorMessage = "La planta debe tener entre 1 y 2 caracteres.")]
        [Column("planta")]
        public string Planta { get; set; }

        [Required(ErrorMessage = "El número de la habitación es obligatorio.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "El número de la habitación debe ser un número de 1 o 2 dígitos.")]
        [StringLength(2, MinimumLength = 1, ErrorMessage = "El número de la habitación debe tener entre 1 y 2 caracteres.")]
        [Column("numero_habitacion")]
        public string NumeroHabitacion { get; set; }
        
        // Propiedad de navegación: Las camas asociadas a la habitación
        public ICollection<Cama> Camas { get; set; }

        // Constructor
        public Habitacion()
        {
            Camas = new List<Cama>();
        }
    }
}
