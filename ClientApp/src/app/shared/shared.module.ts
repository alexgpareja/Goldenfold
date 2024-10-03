import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { SharedRoutingModule } from './shared-routing.module';
import { SearchBoxComponent } from './search-box/search-box.component';

// Angular Material Imports

import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogFormularioComponent } from './dialog-formulario/dialog-formulario.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedRoutingModule,

    // Angular Material Modules
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,     
  ],
  declarations: [
    SearchBoxComponent, 
    DialogFormularioComponent  // Añade ambos componentes aquí
  ],
  exports: [
    CommonModule,
    SearchBoxComponent,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,
    DialogFormularioComponent  // Exporta también el componente DialogFormularioComponent si es necesario fuera de este módulo
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class SharedModule { }
