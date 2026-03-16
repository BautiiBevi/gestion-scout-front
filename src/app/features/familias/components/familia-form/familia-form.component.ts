import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Familia } from '../../../../models/familia.model';
import { CustomValidators } from '../../../../core/utils/custom-validators';

@Component({
  selector: 'app-familia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './familia-form.component.html',
})
export class FamiliaFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() familiaInicial: Familia | null = null;
  @Input() esEdicion: boolean = false;

  @Output() onSubmit = new EventEmitter<Familia>();

  public formEnviado = signal<boolean>(false);

  public familiaForm = this.fb.group({
    apellido_familia: ['', [Validators.required, CustomValidators.formatoFamilia]],
    nombre_padre: [
      '',
      [Validators.required, Validators.minLength(3), CustomValidators.formatoNombrePropio],
    ],
    nombre_madre: [
      '',
      [Validators.required, Validators.minLength(3), CustomValidators.formatoNombrePropio],
    ],
    telefono_padre: ['', [Validators.required, CustomValidators.telefonoValido]],
    telefono_madre: ['', [Validators.required, CustomValidators.telefonoValido]],

    email: ['', [Validators.required, CustomValidators.emailValido]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
  });

  campoEsInvalido(campo: string): boolean {
    const control = this.familiaForm.get(campo);
    return !!(control && control.invalid && (control.touched || this.formEnviado()));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['familiaInicial'] && this.familiaInicial) {
      this.familiaForm.patchValue(this.familiaInicial);
    }
  }

  guardar() {
    if (this.familiaForm.invalid) {
      this.familiaForm.markAllAsTouched();
      return;
    }
    this.onSubmit.emit(this.familiaForm.getRawValue() as Familia);
  }
}
