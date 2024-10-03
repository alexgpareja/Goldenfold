import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar" [ngClass]="snackBarType" *ngIf="visible">
      <p>{{ message }}</p>
    </div>
  `,
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent {
  visible = false; // Cambiado a false por defecto
  message = '';
  snackBarType = ''; // Cambiado a snackBarType para que coincida con tu lógica

  showNotification(type: string, message: string) {
    this.snackBarType = type; // Cambia el tipo de snackbar
    this.message = message;
    this.visible = true; // Cambia a true para mostrar el snackbar

    setTimeout(() => {
      this.visible = false; // Ocultar después de 3 segundos
    }, 3000);
  }
}
