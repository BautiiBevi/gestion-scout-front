import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  @Input() texto: string = 'Cargando...';
}
