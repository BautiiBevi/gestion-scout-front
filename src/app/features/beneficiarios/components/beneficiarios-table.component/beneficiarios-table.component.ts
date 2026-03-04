import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Beneficiario } from '../../../../models/beneficiario.model';

@Component({
  selector: 'app-tabla-beneficiarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './beneficiarios-table.component.html',
})
export class BeneficiariosTableComponent {
  // Recibe la lista desde la página
  @Input() beneficiarios: Beneficiario[] = [];

  // Emite un evento cuando tocan "Eliminar" pasándole el scout
  @Output() onEliminar = new EventEmitter<Beneficiario>();

  eliminar(b: Beneficiario) {
    this.onEliminar.emit(b);
  }
}
