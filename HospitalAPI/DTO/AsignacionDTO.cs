﻿using System;

namespace HospitalApi.DTO
{
    public class AsignacionDTO
{
    public int IdAsignacion { get; set; }
    public int IdPaciente { get; set; }
    public int IdCama { get; set; } 
    public DateTime FechaAsignacion { get; set; }
    public DateTime? FechaLiberacion { get; set; }
    public int AsignadoPor { get; set; }
}

public class AsignacionCreateDTO
{
    public int IdPaciente { get; set; }
    public int IdCama { get; set; }
    public DateTime FechaAsignacion { get; set; }
    public DateTime? FechaLiberacion { get; set; }
    public int AsignadoPor { get; set; }
}

public class AsignacionUpdateDTO
{
    public int IdPaciente { get; set; }
    public int IdCama { get; set; }
    public DateTime FechaAsignacion { get; set; }
    public DateTime? FechaLiberacion { get; set; }
    public int AsignadoPor { get; set; }
}

}
