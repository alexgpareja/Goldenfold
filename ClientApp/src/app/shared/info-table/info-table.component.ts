import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-info-table',
  templateUrl: './info-table.component.html',
  styleUrl: './info-table.component.css'
})
export class InfoTableComponent implements OnInit, AfterViewInit {
  @Input() columns: any[] = []; // Array de columnas que recibe desde el componente padre
  @Input() data: any[] = []; // Datos a mostrar en la tabla
  @Input() showActions: boolean = false; // Opcional para mostrar columnas de acciones

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Inicializamos las columnas
    this.displayedColumns = this.columns.map((c) => c.columnDef);
    if (this.showActions) {
      this.displayedColumns.push('actions');
    }

    // Configuramos los datos
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    // Conectar el paginador y el ordenamiento a la tabla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Método opcional si tienes acciones para editar o eliminar
  onEdit(row: any): void {
    console.log('Editando fila', row);
  }

  onDelete(row: any): void {
    console.log('Eliminando fila', row);
  }
}