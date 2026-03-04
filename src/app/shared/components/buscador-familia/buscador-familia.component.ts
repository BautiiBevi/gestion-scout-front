import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Familia } from '../../../models/familia.model'; // Ajustá el path
import { FamiliaService } from '../../../core/services/familia.service'; // Ajustá el path

@Component({
  selector: 'app-buscador-familia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './buscador-familia.component.html',
})
export class BuscadorFamiliaComponent implements OnInit, OnChanges {
  private familiaService = inject(FamiliaService);

  // Entradas y Salidas
  @Input() familiaInicial: Familia | null = null;
  @Input() mostrarError: boolean = false;
  @Output() familiaSeleccionadaEmit = new EventEmitter<number | null>();

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  // Estado interno
  public buscadorFamilia = new FormControl('');
  public familiasEncontradas = signal<Familia[]>([]);
  public buscandoFamilias = signal<boolean>(false);
  public mostrarResultados = signal<boolean>(false);
  public familiaSeleccionada = signal<Familia | null>(null);

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.mostrarResultados.set(false);
      if (!this.familiaSeleccionada()) {
        this.buscadorFamilia.setValue('', { emitEvent: false });
      }
    }
  }

  // Escuchamos si el padre nos manda una familia inicial (cuando editamos)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['familiaInicial'] && this.familiaInicial) {
      this.familiaSeleccionada.set(this.familiaInicial);
      this.buscadorFamilia.setValue(this.familiaInicial.apellido_familia, { emitEvent: false });
    }
  }

  ngOnInit(): void {
    this.buscadorFamilia.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((termino) => {
          if (!termino || termino.length < 2) {
            this.familiasEncontradas.set([]);
            return of([]);
          }
          this.buscandoFamilias.set(true);
          return this.familiaService.getFamilias(termino);
        }),
      )
      .subscribe({
        next: (familias) => {
          this.familiasEncontradas.set(familias);
          this.buscandoFamilias.set(false);
          this.mostrarResultados.set(true);
        },
        error: () => this.buscandoFamilias.set(false),
      });
  }

  seleccionarFamilia(f: Familia) {
    this.familiaSeleccionada.set(f);
    this.buscadorFamilia.setValue(f.apellido_familia, { emitEvent: false });
    this.mostrarResultados.set(false);
    this.familiaSeleccionadaEmit.emit(f.id_familia!); // Le avisamos al padre
  }

  limpiarSeleccion() {
    this.familiaSeleccionada.set(null);
    this.buscadorFamilia.setValue('');
    this.mostrarResultados.set(true);
    this.familiaSeleccionadaEmit.emit(null); // Le avisamos al padre que se borró
  }
}
