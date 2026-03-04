import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FamiliaService } from '../../../../core/services/familia.service';
import { Familia } from '../../../../models/familia.model';

@Component({
  selector: 'app-familia-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './familia-list.component.html',
})
export class FamiliaListComponent implements OnInit {
  private familiaService = inject(FamiliaService);

  public familias = signal<Familia[]>([]);
  public cargando = signal<boolean>(false);

  ngOnInit() {
    this.cargarFamilias();
  }

  cargarFamilias() {
    this.cargando.set(true);
    this.familiaService.getFamilias().subscribe({
      next: (data) => {
        this.familias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  borrarFamilia(id: number) {
    if (confirm('¿Borrar familia? Se perderán todos sus datos.')) {
      this.familiaService.deleteFamilia(id).subscribe(() => this.cargarFamilias());
    }
  }
}
