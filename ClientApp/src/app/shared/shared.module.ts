import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { SharedRoutingModule } from './shared-routing.module';
import { SearchBoxComponent } from './search-box/search-box.component';
import { InfoTableComponent } from './info-table/info-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedRoutingModule,
    MatTableModule, // Importa MatTableModule
    MatPaginatorModule, // Importa MatPaginatorModule
    MatSortModule, // Importa MatSortModule
    MatButtonModule, // Para los botones de acciones
  ],
  declarations: [SearchBoxComponent, InfoTableComponent],
  exports: [
    CommonModule,
    SearchBoxComponent,
    InfoTableComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
  ],
})
export class SharedModule { }
