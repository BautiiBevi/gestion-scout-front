import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CustomValidators } from '../../../../core/utils/custom-validators';

@Component({
  selector: 'app-add-edit-user-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-edit-user-page.component.html',
})
export class AddEditUserPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public usuarioId: number | null = null;
  public cargando = signal(false);
  public guardando = signal(false);
  public errorMsg = signal<string | null>(null);
  public formEnviado = signal<boolean>(false);

  public usuarioForm = this.fb.group({
    nombre: ['', [Validators.required, CustomValidators.formatoNombrePropio]],
    apellido: ['', [Validators.required, CustomValidators.formatoNombrePropio]],
    dni: ['', [Validators.required, CustomValidators.dniValido]],
    email: ['', [Validators.required, CustomValidators.emailValido]],
    rol: ['', Validators.required],
  });

  ngOnInit() {
    // Si viene un ID por la URL, es Edición
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.usuarioId = Number(id);
        this.cargarDirigente(this.usuarioId);
      }
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.usuarioForm.get(campo);
    return !!(control && control.invalid && (control.touched || this.formEnviado()));
  }

  cargarDirigente(id: number) {
    this.cargando.set(true);

    this.usuarioService.getUsuarioById(id).subscribe({
      next: (user) => {
        this.usuarioForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          dni: user.dni,
          email: user.email,
          rol: user.rol,
        });
        this.cargando.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la información del dirigente.');
        this.cargando.set(false);
      },
    });
  }

  guardar() {
    this.formEnviado.set(true);
    if (this.usuarioForm.invalid) return;

    this.guardando.set(true);
    this.errorMsg.set(null);

    const datos = this.usuarioForm.value;

    if (this.usuarioId) {
      this.usuarioService.actualizarUsuario(this.usuarioId, datos).subscribe({
        next: () => {
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMsg.set(err.error.message);
          } else {
            this.errorMsg.set('Error al actualizar los datos.');
          }
          this.guardando.set(false);
        },
      });
    } else {
      this.usuarioService.crearUsuario(datos).subscribe({
        next: () => {
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMsg.set(err.error.message);
          } else {
            this.errorMsg.set('Error al crear el dirigente.');
          }
          this.guardando.set(false);
        },
      });
    }
  }
}
