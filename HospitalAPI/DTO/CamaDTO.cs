using System;
using System.ComponentModel.DataAnnotations;


namespace HospitalApi.DTO

{
    using System.ComponentModel.DataAnnotations;
    public class CamaDTO
    {
        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "La ubicación debe tener exactamente 8 caracteres.")]
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string Tipo { get; set; }
    }

    public class CamaCreateDTO
    {
        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "La ubicación debe tener exactamente 8 caracteres.")]
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string Tipo { get; set; }
    }

    public class CamaUpdateDTO
    {
        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "La ubicación debe tener exactamente 8 caracteres.")]
        public string Ubicacion { get; set; }

        [Required(ErrorMessage = "El estado de la cama es obligatorio.")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "El tipo de cama es obligatorio.")]
        public string Tipo { get; set; }
    }
}
