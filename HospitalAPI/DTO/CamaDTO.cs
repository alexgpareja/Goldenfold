using System;

namespace HospitalApi.DTO
{
    public class CamaDTO
    {
        public int IdCama { get; set; }
        public string Ubicacion { get; set; }
        public string Estado { get; set; }
        public string Tipo { get; set; }
        public int IdHabitacion { get; set; }
    }

    public class CamaCreateDTO
    {
        public string Ubicacion { get; set; }
        public EstadoCama Estado { get; set; }
        public TipoCama Tipo { get; set; }
        public int IdHabitacion { get; set; }
    }

    public class CamaUpdateDTO
    {
        public int IdCama { get; set; }
        public string Ubicacion { get; set; }
        public string Estado { get; set; }
        public string Tipo { get; set; }
        public int IdHabitacion { get; set; }
    }
}
