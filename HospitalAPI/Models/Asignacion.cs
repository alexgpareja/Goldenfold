using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Asignacion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_asignacion")]
        public int IdAsignacion { get; set; }

        [Required(ErrorMessage = "El ID del paciente es obligatorio.")]
        [ForeignKey("Paciente")]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [ForeignKey("Cama")]
        [Required(ErrorMessage = "El ID de la cama es obligatorio.")]
        [Column("id_cama")]
        public int IdCama { get; set; }

        [Required(ErrorMessage = "La fecha de asignación es obligatoria.")]
        [Column("fecha_asignacion")]
        public DateTime FechaAsignacion { get; set; } = DateTime.Now;

        [Column("fecha_liberacion")]
        [DataType(DataType.DateTime)]
        [CustomValidation(typeof(Asignacion), nameof(ValidarFechaLiberacion))]
        public DateTime? FechaLiberacion { get; set; }

        [Required(ErrorMessage = "El usuario que asignó la cama es obligatorio.")]
        [ForeignKey("Usuario")]
        [Column("asignado_por")]
        public int AsignadoPor { get; set; }

        public Paciente Paciente { get; set; }
        public Cama Cama { get; set; } 
        public Usuario Usuario { get; set; }
        public ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();

        // Constructor
        public Asignacion()
        {
            Ingresos = new List<Ingreso>();
        }

        public static ValidationResult ValidarFechaLiberacion(DateTime? fechaLiberacion, ValidationContext context)
        {
            var instance = context.ObjectInstance as Asignacion;

            if (fechaLiberacion.HasValue && fechaLiberacion.Value < instance.FechaAsignacion)
            {
                return new ValidationResult("La fecha de liberación no puede ser anterior a la fecha de asignación.");
            }

            return ValidationResult.Success;
        }
    }
}

