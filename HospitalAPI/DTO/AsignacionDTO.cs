using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalApi.DTO
{
    public class AsignacionDTO
    {
        public int IdAsignacion { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID de la cama es obligatorio.")]
        public int IdCama { get; set; } // Reemplazado por IdCama

        [Required(ErrorMessage = "La fecha de asignación es obligatoria.")]
        public DateTime FechaAsignacion { get; set; }

        public DateTime? FechaLiberacion { get; set; }

        [Required(ErrorMessage = "El ID del usuario que asignó la cama es obligatorio.")]
        public int AsignadoPor { get; set; }
    }

    public class AsignacionCreateDTO
    {
        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID de la cama es obligatorio.")]
        public int IdCama { get; set; } // Reemplazado por IdCama

        [Required(ErrorMessage = "La fecha de asignación es obligatoria.")]
        public DateTime FechaAsignacion { get; set; }

        public DateTime? FechaLiberacion { get; set; }

        [Required(ErrorMessage = "El ID del usuario que asignó la cama es obligatorio.")]
        public int AsignadoPor { get; set; }
    }

    public class AsignacionUpdateDTO
    {
        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El ID de la cama es obligatorio.")]
        public int IdCama { get; set; } // Reemplazado por IdCama

        [Required(ErrorMessage = "La fecha de asignación es obligatoria.")]
        public DateTime FechaAsignacion { get; set; }

        public DateTime? FechaLiberacion { get; set; }

        [Required(ErrorMessage = "El ID del usuario que asignó la cama es obligatorio.")]
        public int AsignadoPor { get; set; }
    }
}
