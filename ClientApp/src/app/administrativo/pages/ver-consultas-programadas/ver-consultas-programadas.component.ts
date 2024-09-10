import { Component } from '@angular/core';
import { ApiService, Consulta } from '../../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ver-consultas-programadas',
  templateUrl: './ver-consultas-programadas.component.html',
  styleUrls: ['./ver-consultas-programadas.component.css']
})
export class VerConsultasProgramadasComponent {
  consultas: any[] = []; // Array para almacenar las consultas obtenidas del servicio.
  expandedIndex: number | null = null; // Índice de la fila expandida, o null si ninguna está expandida.
  searchText: string = ''; // Texto de búsqueda ingresado por el usuario.
  sortOption: string = 'FechaSolicitud'; // Propiedad por la cual se ordenarán las consultas.
  currentPage: number = 1; // Página actual en la paginación.
  itemsPerPage: number = 9; // Número de items a mostrar por página.

  constructor(private consultasService: ApiService) {} // Inyección del servicio para obtener las consultas.

  ngOnInit(): void {
    // Método de inicialización del componente.
    // Se llama al servicio para obtener las consultas cuando el componente se inicia.
    this.consultasService.getConsultas().subscribe(
      (data) => {
        this.consultas = data; // Asigna los datos obtenidos al array `consultas`.
      },
      (error) => {
        console.error('Error al obtener las consultas:', error); // Manejo de errores en caso de fallo.
      }
    );
  }

  get filteredConsultas() {
    // Método para filtrar y ordenar las consultas según el texto de búsqueda y la opción de ordenamiento.
    const lowerCaseSearchText = this.searchText.toLowerCase(); // Convertir el texto de búsqueda a minúsculas.

    const filtered = this.consultas
      .filter(consulta =>
        (consulta.IdPaciente && consulta.IdPaciente.toString().toLowerCase().includes(lowerCaseSearchText)) ||
        (consulta.IdMedico && consulta.IdMedico.toString().toLowerCase().includes(lowerCaseSearchText)) ||
        (consulta.Motivo && consulta.Motivo.toLowerCase().includes(lowerCaseSearchText)) ||
        (consulta.FechaSolicitud && consulta.FechaSolicitud.toLowerCase().includes(lowerCaseSearchText)) ||
        (consulta.Estado && consulta.Estado.toLowerCase().includes(lowerCaseSearchText))
      )
      // Ordenar las consultas dinámicamente por la propiedad seleccionada en `sortOption`.
      .sort((a, b) => {
        const fieldA = a[this.sortOption] ? a[this.sortOption].toString().toLowerCase() : '';
        const fieldB = b[this.sortOption] ? b[this.sortOption].toString().toLowerCase() : '';

        if (fieldA < fieldB) return -1;
        if (fieldA > fieldB) return 1;
        return 0;
      });

    // Calcular los índices de inicio y fin para la paginación.
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex); // Retornar un subconjunto de consultas basado en la página actual.
  }

  get totalPages() {
    // Método para calcular el número total de páginas en base a las consultas filtradas y el número de items por página.
    const totalItems = this.consultas.filter(consulta =>
      (consulta.IdPaciente && consulta.IdPaciente.toString().toLowerCase().includes(this.searchText.toLowerCase())) ||
      (consulta.FechaSolicitud && consulta.FechaSolicitud.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (consulta.IdMedico && consulta.IdMedico.toString().toLowerCase().includes(this.searchText.toLowerCase())) ||
      (consulta.Motivo && consulta.Motivo.toLowerCase().includes(this.searchText.toLowerCase())) ||
      (consulta.Estado && consulta.Estado.toLowerCase().includes(this.searchText.toLowerCase()))
    ).length;

    return Math.ceil(totalItems / this.itemsPerPage); // Retornar el número total de páginas, redondeando hacia arriba.
  }

  toggleExpand(index: number): void {
    // Método para alternar la expansión de una fila.
    // Si el índice actual es igual al índice dado, se colapsa (se pone en null).
    // De lo contrario, se expande la fila con el índice dado.
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  goToPage(page: number): void {
    // Método para cambiar la página actual en la paginación.
    // Asegurarse de que la página esté dentro del rango válido.
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
