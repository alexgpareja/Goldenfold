using System;
using System.ComponentModel.DataAnnotations;


namespace HospitalApi.DTO

{
    public class HabitacionDTO
    {
        public int IdHabitacion { get; set; }

        [Required(ErrorMessage = "El edificio es obligatorio.")]
        [StringLength(2, ErrorMessage = "El edificio debe tener entre 1 y 2 caracteres.")]
        public string Edificio { get; set; }

        [Required(ErrorMessage = "La planta es obligatoria.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "La planta debe ser un número de 1 o 2 dígitos.")]
        public string Planta { get; set; }

        [Required(ErrorMessage = "El número de habitación es obligatorio.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "El número de habitación debe ser un número de 1 o 2 dígitos.")]
        public string NumeroHabitacion { get; set; }
    }

    public class HabitacionCreateDTO
    {
        [Required(ErrorMessage = "El edificio es obligatorio.")]
        [StringLength(2, ErrorMessage = "El edificio debe tener entre 1 y 2 caracteres.")]
        public string Edificio { get; set; }

        [Required(ErrorMessage = "La planta es obligatoria.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "La planta debe ser un número de 1 o 2 dígitos.")]
        public string Planta { get; set; }

        [Required(ErrorMessage = "El número de habitación es obligatorio.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "El número de habitación debe ser un número de 1 o 2 dígitos.")]
        public string NumeroHabitacion { get; set; }

        public string TipoCama {get; set; }
    }

    public class HabitacionUpdateDTO
    {
        [Required(ErrorMessage = "El edificio es obligatorio.")]
        [StringLength(2, ErrorMessage = "El edificio debe tener entre 1 y 2 caracteres.")]
        public string Edificio { get; set; }

        [Required(ErrorMessage = "La planta es obligatoria.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "La planta debe ser un número de 1 o 2 dígitos.")]
        public string Planta { get; set; }

        [Required(ErrorMessage = "El número de habitación es obligatorio.")]
        [RegularExpression(@"^\d{1,2}$", ErrorMessage = "El número de habitación debe ser un número de 1 o 2 dígitos.")]
        public string NumeroHabitacion { get; set; }
    }
}
