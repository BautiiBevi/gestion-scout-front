import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  @Input() modalId: string = 'modal_confirmacion'; // ID por defecto
  @Input() titulo: string = '¿Estás seguro?';
  @Input() mensaje: string = 'Esta acción no se puede deshacer.';
  @Input() textoBoton: string = 'Eliminar';

  @Output() confirmar = new EventEmitter<void>();
}
