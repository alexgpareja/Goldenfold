using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTO
{
    public class HistorialAltaDTO
    {
        public int IdHistorial { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "La fecha de alta es obligatoria.")]
        public DateTime FechaAlta { get; set; }

        [Required(ErrorMessage = "El diagnóstico es obligatorio.")]
        [StringLength(255, ErrorMessage = "El diagnóstico no puede tener más de 255 caracteres.")]
        public string Diagnostico { get; set; }

        [Required(ErrorMessage = "El tratamiento es obligatorio.")]
        [StringLength(255, ErrorMessage = "El tratamiento no puede tener más de 255 caracteres.")]
        public string Tratamiento { get; set; }

        // Agregar la propiedad IdMedico en el DTO de consulta
        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int IdMedico { get; set; }  // <-- Corregido
    }

    public class HistorialAltaCreateDTO
    {
        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El diagnóstico es obligatorio.")]
        [StringLength(255, ErrorMessage = "El diagnóstico no puede tener más de 255 caracteres.")]
        public string Diagnostico { get; set; }

        [Required(ErrorMessage = "El tratamiento es obligatorio.")]
        [StringLength(255, ErrorMessage = "El tratamiento no puede tener más de 255 caracteres.")]
        public string Tratamiento { get; set; }

        // Agregar la propiedad IdMedico en el DTO de creación
        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int IdMedico { get; set; }  // <-- Corregido
    }

    public class HistorialAltaUpdateDTO
    {
        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El diagnóstico es obligatorio.")]
        [StringLength(255, ErrorMessage = "El diagnóstico no puede tener más de 255 caracteres.")]
        public string Diagnostico { get; set; }

        [Required(ErrorMessage = "El tratamiento es obligatorio.")]
        [StringLength(255, ErrorMessage = "El tratamiento no puede tener más de 255 caracteres.")]
        public string Tratamiento { get; set; }

        // Agregar la propiedad IdMedico en el DTO de actualización
        [Required(ErrorMessage = "El ID del médico es obligatorio.")]
        public int IdMedico { get; set; }  // <-- Corregido
    }
}
