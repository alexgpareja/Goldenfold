namespace HospitalApi.DTO
{
    public class PacienteDTO
    {
        public int IdPaciente { get; set; }
        public string Nombre { get; set; }
        public int Edad { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Sintomas { get; set; }
        public string Estado { get; set; }
        public string SeguridadSocial { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string HistorialMedico { get; set; }
    }

    public class PacienteCreateDTO
    {
        public string Nombre { get; set; }
        public int Edad { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Sintomas { get; set; }
        public string Estado { get; set; }
        public string SeguridadSocial { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string HistorialMedico { get; set; }
    }
}
