import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-olvide-password',
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
  templateUrl: './olvide-password.component.html',
  styleUrl: './olvide-password.component.scss'
})
export class OlvidePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  enviando = signal(false);
  enviado = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  enviar(): void {
    if (this.form.invalid) return;

    this.enviando.set(true);
    const email = this.form.value.email!;

    this.authService.olvidePassword(email).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: () => {
        this.enviando.set(false);
        this.snackBar.open('No se pudo enviar el email. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}