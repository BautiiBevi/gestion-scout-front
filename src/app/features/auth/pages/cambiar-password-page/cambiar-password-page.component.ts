import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
// 👇 Importamos los validadores
import { CustomValidators } from '../../../../core/utils/custom-validators';

@Component({
  selector: 'app-cambiar-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-password-page.component.html',
})
export class CambiarPasswordPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public errorMsg = signal<string | null>(null);
  public guardando = signal(false);

  // 👇 La banderita para no molestar al usuario mientras escribe
  public formEnviado = signal<boolean>(false);

  // 👇 El formulario con las nuevas reglas
  public passForm = this.fb.group(
    {
      nueva: ['', [Validators.required, CustomValidators.passwordFuerte]],
      confirmacion: ['', [Validators.required]],
    },
    {
      // Acá va el validador que compara ambos campos
      validators: [CustomValidators.passwordsIguales('nueva', 'confirmacion')],
    },
  );

  // 👇 La misma función inteligente del Login
  campoEsInvalido(campo: string): boolean {
    const control = this.passForm.get(campo);
    return !!(control && control.invalid && this.formEnviado());
  }

  guardar() {
    this.formEnviado.set(true); // Levanta la bandera al hacer clic

    if (this.passForm.invalid) return; // Si hay errores, no avanza

    const { nueva } = this.passForm.value;

    this.guardando.set(true);
    this.errorMsg.set(null);

    this.authService.cambiarPassword(nueva!).subscribe((exito) => {
      if (exito) {
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Hubo un error al actualizar la contraseña.');
        this.guardando.set(false);
      }
    });
  }
}
