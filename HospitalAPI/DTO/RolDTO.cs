namespace HospitalApi.DTO
{
    public class RolDTO
    {
        public int IdRol { get; set; }
        public string NombreRol { get; set; }
    }

    public class RolCreateDTO
    {
        public string NombreRol { get; set; }
    }
    public class RolUpdateDTO
    {
        public string NombreRol { get; set; }
    }

}
