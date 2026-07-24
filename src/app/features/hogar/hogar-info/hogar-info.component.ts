import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HogarService } from '../../../core/services/hogar.service';
import { Hogar } from '../../../core/models/hogar.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hogar-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './hogar-info.component.html',
  styleUrl: './hogar-info.component.scss'
})
export class HogarInfoComponent implements OnInit {
  private hogarService = inject(HogarService);
  private snackBar = inject(MatSnackBar);

  hogar = signal<Hogar | null>(null);
  loading = signal(true);
  private router = inject(Router);


  ngOnInit() {
    this.hogarService.obtenerInfo().subscribe({
      next: (data) => {
        this.hogar.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  copiarCodigo() {
    const codigo = this.hogar()?.codigoInvitacion;
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      this.snackBar.open('Código copiado al portapapeles', 'Cerrar', { duration: 2000 });
    }
  }
  volver() {
    this.router.navigate(['/tareas']);
  }
}