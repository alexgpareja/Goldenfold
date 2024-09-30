using System;

namespace HospitalApi.DTO

{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string NombreUsuario { get; set; }
        public int IdRol { get; set; }
    }

    public class UsuarioCreateDTO
    {
        public string Nombre { get; set; }
        public string NombreUsuario { get; set; }
        public string Contrasenya { get; set; }
        public int IdRol { get; set; }
    }

    public class UsuarioUpdateDTO
    {
        public string Nombre { get; set; }
        public string NombreUsuario { get; set; }
        public string Contrasenya { get; set; }
        public int IdRol { get; set; }
    }
}
