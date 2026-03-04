import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FamiliaService } from '../../../../core/services/familia.service';
import { Familia } from '../../../../models/familia.model';

import { TablaFamiliasComponent } from '../../components/familias-table/familias-table.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component/loading-spinner.component';
import { AlertErrorComponent } from '../../../../shared/components/alert-error/alert-error.component';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-familia-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TablaFamiliasComponent,
    LoadingSpinnerComponent,
    AlertErrorComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './familia-list-page.component.html',
})
export class FamiliaListComponent implements OnInit {
  private familiaService = inject(FamiliaService);

  public familias = signal<Familia[]>([]);
  public familiaSeleccionada = signal<Familia | null>(null);
  public cargando = signal<boolean>(false);
  public errorMsg = signal<string | null>(null);

  ngOnInit() {
    this.cargarFamilias();
  }

  cargarFamilias(forzarRecarga: boolean = false) {
    this.cargando.set(true);
    this.errorMsg.set(null);
    // undefined porque no estamos buscando, forzarRecarga para saltar caché
    this.familiaService.getFamilias(undefined, forzarRecarga).subscribe({
      next: (data) => {
        this.familias.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la nómina de familias.');
        this.cargando.set(false);
      },
    });
  }

  prepararBorrado(familia: Familia) {
    this.familiaSeleccionada.set(familia);
    (document.getElementById('modal_confirmar_borrado') as HTMLDialogElement).showModal();
  }

  confirmarBorrado() {
    const f = this.familiaSeleccionada();
    if (f?.id_familia) {
      this.familiaService.deleteFamilia(f.id_familia).subscribe({
        next: () => {
          this.cargarFamilias(true); // Forzamos recarga para ver los cambios
          this.familiaSeleccionada.set(null);
        },
        error: () => {
          // Cambiamos el alert() por nuestro hermoso componente de error
          this.errorMsg.set(
            '⚠️ No se puede borrar esta familia porque tiene beneficiarios asociados.',
          );
        },
      });
    }
  }
}
