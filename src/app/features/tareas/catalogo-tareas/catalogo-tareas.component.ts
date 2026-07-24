import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TareaService } from '../../../core/services/tarea.service';
import { Tarea } from '../../../core/models';

@Component({
  selector: 'app-catalogo-tareas',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './catalogo-tareas.component.html',
  styleUrl: './catalogo-tareas.component.scss'
})
export class CatalogoTareasComponent implements OnInit {
  private tareaService = inject(TareaService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  tareas = signal<Tarea[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.tareaService.listarCatalogo().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo.');
        this.cargando.set(false);
      }
    });
  }

  activar(id: number): void {
    this.tareaService.activar(id).subscribe({
      next: () => {
        this.tareas.update(lista => lista.filter(t => t.id !== id));
        this.snackBar.open('Tarea activada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => this.snackBar.open('No se pudo activar la tarea.', 'Cerrar', { duration: 3000 })
    });
  }

  volver(): void {
    this.router.navigate(['/tareas']);
  }
}