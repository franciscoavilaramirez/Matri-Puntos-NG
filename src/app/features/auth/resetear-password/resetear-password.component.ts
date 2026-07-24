import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const nueva = control.get('passwordNueva')?.value;
  const confirmacion = control.get('passwordNuevaConfirmacion')?.value;
  return nueva === confirmacion ? null : { passwordsNoCoinciden: true };
}

@Component({
  selector: 'app-resetear-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './resetear-password.component.html',
  styleUrl: './resetear-password.component.scss'
})
export class ResetearPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  enviando = signal(false);
  completado = signal(false);
  token = signal<string | null>(null);

  form = this.fb.group({
    passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
    passwordNuevaConfirmacion: ['', [Validators.required]]
  }, { validators: passwordsIgualesValidator });

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.token.set(token);
  }

  enviar(): void {
    if (this.form.invalid || !this.token()) return;

    this.enviando.set(true);

    this.authService.resetearPassword({
      token: this.token()!,
      passwordNueva: this.form.value.passwordNueva!,
      passwordNuevaConfirmacion: this.form.value.passwordNuevaConfirmacion!
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.completado.set(true);
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.enviando.set(false);
        this.snackBar.open('El enlace no es válido o ha caducado.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}