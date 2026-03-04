import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector-rama',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selector-rama.component.html',
})
export class SelectorRamaComponent {
  @Input() ramaActual: string = 'Manada';

  @Output() ramaSeleccionada = new EventEmitter<string>();

  seleccionarRama(rama: string) {
    this.ramaSeleccionada.emit(rama);
  }
}
