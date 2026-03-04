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
import { Familia } from '../../../../models/familia.model';

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

  public familiaForm = this.fb.group({
    apellido_familia: ['', [Validators.required, Validators.minLength(3)]],
    nombre_padre: ['', [Validators.required, Validators.minLength(3)]],
    nombre_madre: ['', [Validators.required, Validators.minLength(3)]],
    telefono_padre: ['', [Validators.required, Validators.minLength(3)]],
    telefono_madre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
  });

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
