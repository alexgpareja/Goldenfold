using System;
using System.ComponentModel.DataAnnotations;


namespace HospitalApi.DTO

{
    public class RolDTO
    {
        public int IdRol { get; set; }
        
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre del rol no puede tener más de 50 caracteres.")]
        public string NombreRol { get; set; }
    }

    public class RolCreateDTO
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre del rol no puede tener más de 50 caracteres.")]
        public string NombreRol { get; set; }
    }

    public class RolUpdateDTO
    {
        [Required(ErrorMessage = "El nombre del rol es obligatorio.")]
        [StringLength(50, ErrorMessage = "El nombre del rol no puede tener más de 50 caracteres.")]
        public string NombreRol { get; set; }
    }
}
