import { Component, inject, OnInit, signal } from '@angular/core';
import { BeneficiarioService } from '../../../../core/services/beneficiario.service';
import { Beneficiario } from '../../../../models/beneficiario.model';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { AlertErrorComponent } from '../../../../shared/components/alert-error/alert-error.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component/loading-spinner.component';
import { BeneficiariosTableComponent } from '../../components/beneficiarios-table.component/beneficiarios-table.component';

@Component({
  selector: 'app-beneficiario-list',
  standalone: true,
  imports: [
    RouterLink,
    ConfirmModalComponent,
    AlertErrorComponent,
    LoadingSpinnerComponent,
    BeneficiariosTableComponent,
  ],
  templateUrl: './beneficiario-list.component.html',
})
export class BeneficiarioListComponent implements OnInit {
  private beneficiarioService = inject(BeneficiarioService);

  public beneficiarios = signal<Beneficiario[]>([]);
  public beneficiarioSeleccionado = signal<any>(null);
  public cargando = signal<boolean>(true);
  public error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarBeneficiarios();
  }

  cargarBeneficiarios(forzarRecarga: boolean = false) {
    this.cargando.set(true);
    this.error.set(null); // Limpiamos errores previos por si acaso

    // Le pasamos el "forzarRecarga" al servicio que creamos recién
    this.beneficiarioService.getBeneficiarios(forzarRecarga).subscribe({
      next: (data) => {
        this.beneficiarios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los beneficiarios.');
        this.cargando.set(false);
      },
    });
  }

  limpiarError() {
    this.error.set(null);
  }

  prepararBorrado(beneficiario: any) {
    this.beneficiarioSeleccionado.set(beneficiario);
    const modal = document.getElementById('modal_confirmar_borrado') as HTMLDialogElement;
    modal?.showModal();
  }

  confirmarBorrado() {
    const b = this.beneficiarioSeleccionado();
    if (b) {
      this.beneficiarioService.deleteBeneficiario(b.id_beneficiario).subscribe({
        next: () => {
          this.cargarBeneficiarios();
          this.beneficiarioSeleccionado.set(null);
        },
      });
    }
  }
}
