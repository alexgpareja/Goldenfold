using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalApi
{
    public class Paciente
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        [Column("id_paciente")]
        public int IdPaciente { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede tener más de 100 caracteres.")]
        [Column("nombre")] 
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El DNI es obligatorio.")]
        [RegularExpression(@"^[0-9]{8}[A-Za-z]$", ErrorMessage = "El DNI debe tener 8 números seguidos de una letra.")]
        [StringLength(9, MinimumLength = 9, ErrorMessage = "El DNI debe tener exactamente 9 caracteres.")]
        [Column("dni")]
        public string Dni { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
        [Column("fecha_nacimiento")]
        public DateTime FechaNacimiento { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio.")]
        [Column("estado")]
        public EstadoPaciente Estado { get; set; } = EstadoPaciente.Registrado;

        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "El número de seguridad social es obligatorio.")]
        [RegularExpression(@"^\d{12}$", ErrorMessage = "El número de la seguridad social debe tener exactamente 12 dígitos.")]
        [StringLength(12, MinimumLength = 12, ErrorMessage = "El número de seguridad social debe tener exactamente 12 dígitos.")]
        [Column("seguridad_social")]
        public string SeguridadSocial { get; set; }

        [StringLength(255, ErrorMessage = "La dirección no puede tener más de 255 caracteres.")]
        [Column("direccion")]
        public string Direccion { get; set; }

        [StringLength(9, MinimumLength = 9, ErrorMessage = "El teléfono debe tener exactamente 9 caracteres.")]
        [RegularExpression(@"^\d{9}$", ErrorMessage = "El teléfono debe contener exactamente 9 dígitos.")]
        [Column("telefono")]
        public string Telefono { get; set; }

        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        [StringLength(100, ErrorMessage = "El correo electrónico no puede tener más de 100 caracteres.")]
        [Column("email")]
        public string Email { get; set; }

        [Column("historial_medico")]
        public string HistorialMedico { get; set; }

        // Propiedades de navegación
        public ICollection<HistorialAlta> HistorialAltas { get; set; }
        public ICollection<Asignacion> Asignaciones { get; set; }
        public ICollection<Consulta> Consultas { get; set; } = new List<Consulta>();
        public ICollection<Ingreso> Ingresos { get; set; } = new List<Ingreso>();

        // Constructor
        public Paciente()
        {
            FechaRegistro = DateTime.Now;
            HistorialAltas = new List<HistorialAlta>();
            Asignaciones = new List<Asignacion>();
            Consultas = new List<Consulta>();
            Ingresos = new List<Ingreso>();
        }
    }

    // Enum para el estado del paciente
    public enum EstadoPaciente
    {
        Registrado,
        EnConsulta,
        Ingresado,
        Alta
    }
}
