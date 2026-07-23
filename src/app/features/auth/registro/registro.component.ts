import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

type ModoRegistro = 'crear' | 'unirse';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMsg = signal<string | null>(null);
  hidePassword = signal(true);
  modo = signal<ModoRegistro>('crear');
  codigoGenerado = signal<string | null>(null);

  esCrear = computed(() => this.modo() === 'crear');

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombreHogar: [''],
    codigoInvitacion: ['']
  });

  cambiarModo(nuevoModo: ModoRegistro): void {
    this.modo.set(nuevoModo);
    this.errorMsg.set(null);

    if (nuevoModo === 'crear') {
      this.form.get('codigoInvitacion')?.reset();
      this.form.get('nombreHogar')?.setValidators([Validators.required]);
    } else {
      this.form.get('nombreHogar')?.reset();
      this.form.get('codigoInvitacion')?.setValidators([Validators.required]);
      this.form.get('nombreHogar')?.clearValidators();
    }
    this.form.get('nombreHogar')?.updateValueAndValidity();
    this.form.get('codigoInvitacion')?.updateValueAndValidity();
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const raw = this.form.getRawValue();
    const payload = {
      nombre: raw.nombre!,
      email: raw.email!,
      password: raw.password!,
      ...(this.esCrear()
        ? { nombreHogar: raw.nombreHogar! }
        : { codigoInvitacion: raw.codigoInvitacion! })
    };


    this.authService.registro(payload).subscribe({
      next: (response) => {
        console.log('Respuesta OK:', response);
        this.loading.set(false);
        if (this.esCrear() && response.codigoInvitacionHogar) {
          this.codigoGenerado.set(response.codigoInvitacionHogar);
        } else {
          this.router.navigate(['/tareas']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set('No se pudo completar el registro. Revisa los datos.');
      }
    });
  }

  continuar(): void {
    this.router.navigate(['/tareas']);
  }
}