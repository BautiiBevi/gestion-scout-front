import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-error',
  standalone: true,
  templateUrl: './alert-error.component.html',
})
export class AlertErrorComponent {
  @Input() mensaje: string | null = null;
  @Output() cerrar = new EventEmitter<void>();
}
