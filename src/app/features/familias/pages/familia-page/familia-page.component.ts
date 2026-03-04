import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FamiliaService } from '../../../../core/services/familia.service';
import { Familia } from '../../../../models/familia.model';

// NUESTROS COMPONENTES
import { AlertErrorComponent } from '../../../../shared/components/alert-error/alert-error.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner.component/loading-spinner.component';
import { FamiliaFormComponent } from '../../components/familia-form/familia-form.component';

@Component({
  selector: 'app-familia-page', // Lo ideal sería llamarlo app-familia-page, pero lo dejamos así
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FamiliaFormComponent,
    AlertErrorComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './familia-page.component.html',
})
export class FamiliaPageComponent implements OnInit {
  private familiaService = inject(FamiliaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public familiaId: number | null = null;
  public cargando = signal<boolean>(false);
  public errorMsg = signal<string | null>(null);

  public familiaPrecargada = signal<Familia | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.familiaId = Number(idParam);
      this.cargando.set(true);
      this.cargarDatos(this.familiaId);
    }
  }

  cargarDatos(id: number) {
    this.familiaService.getFamiliaById(id).subscribe({
      next: (data) => {
        this.familiaPrecargada.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMsg.set('No se pudo cargar la familia.');
      },
    });
  }

  procesarGuardado(datos: Familia) {
    this.cargando.set(true);
    this.errorMsg.set(null);

    const request = this.familiaId
      ? this.familiaService.updateFamilia(this.familiaId, datos)
      : this.familiaService.createFamilia(datos);

    request.subscribe({
      next: () => this.router.navigate(['/familias']),
      error: (err) => {
        this.cargando.set(false);
        this.errorMsg.set(err.error?.message || 'Error al guardar los datos.');
      },
    });
  }
}
