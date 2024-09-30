using System;

namespace HospitalApi.DTO

{
    public class HabitacionDTO
    {
        public int IdHabitacion { get; set; }
        public string Edificio { get; set; }
        public string Planta { get; set; }
        public string NumeroHabitacion { get; set; }
    }

    public class HabitacionCreateDTO
    {
        public string Edificio { get; set; }
        public string Planta { get; set; }
        public string NumeroHabitacion { get; set; }
        public string TipoCama {get; set; }
    }

    public class HabitacionUpdateDTO
    {
        public string Edificio { get; set; }
        public string Planta { get; set; }
        public string NumeroHabitacion { get; set; }
    }
}
