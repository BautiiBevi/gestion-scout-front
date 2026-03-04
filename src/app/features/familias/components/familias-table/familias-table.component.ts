import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Familia } from '../../../../models/familia.model';

@Component({
  selector: 'app-tabla-familias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './familias-table.component.html',
})
export class TablaFamiliasComponent {
  @Input() familias: Familia[] = [];
  @Output() onEliminar = new EventEmitter<Familia>();

  eliminar(f: Familia) {
    this.onEliminar.emit(f);
  }
}
