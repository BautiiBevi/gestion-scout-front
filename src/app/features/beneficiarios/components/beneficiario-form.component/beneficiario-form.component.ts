import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Beneficiario } from '../../../../models/beneficiario.model';
import { Familia } from '../../../../models/familia.model';
import { BuscadorFamiliaComponent } from '../../../../shared/components/buscador-familia/buscador-familia.component';
import { SelectorRamaComponent } from '../../../../shared/components/selector-rama/selector-rama.component';

@Component({
  selector: 'app-formulario-beneficiario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuscadorFamiliaComponent, SelectorRamaComponent],
  templateUrl: './beneficiario-form.component.html',
})
export class FormularioBeneficiarioComponent implements OnChanges {
  private fb = inject(FormBuilder);

  // Recibe datos de la página madre
  @Input() beneficiarioInicial: Beneficiario | null = null;
  @Input() familiaPrecargada: Familia | null = null;
  @Input() esEdicion: boolean = false;

  // Emite el objeto listo para guardar
  @Output() onSubmit = new EventEmitter<Beneficiario>();

  public beneficiarioForm = this.fb.group({
    id_familia: [null as number | null, Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]{7,8}$')]],
    fecha_nacimiento: ['', Validators.required],
    rama_actual: ['Manada', Validators.required],
  });

  // Si la página nos pasa un beneficiario para editar, llenamos el form
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficiarioInicial'] && this.beneficiarioInicial) {
      this.beneficiarioForm.patchValue(this.beneficiarioInicial);
    }
  }

  actualizarFamilia(id: number | null) {
    this.beneficiarioForm.patchValue({ id_familia: id });
  }

  actualizarRama(nuevaRama: string) {
    this.beneficiarioForm.patchValue({ rama_actual: nuevaRama });
  }

  guardar() {
    if (this.beneficiarioForm.invalid) {
      this.beneficiarioForm.markAllAsTouched();
      return;
    }
    // Emitimos los datos limpios al padre
    this.onSubmit.emit(this.beneficiarioForm.getRawValue() as Beneficiario);
  }
}
