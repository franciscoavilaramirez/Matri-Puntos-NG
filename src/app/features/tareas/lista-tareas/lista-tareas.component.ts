import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TareaService } from '../../../core/services/tarea.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { SessionService } from '../../../core/services/session.service';
import { Tarea, CrearTareaRequest, EditarTareaRequest } from '../../../core/models';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CrearTareaDialogComponent } from '../crear-tarea-dialog/crear-tarea-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-tareas',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TaskCardComponent
  ],
  templateUrl: './lista-tareas.component.html',
  styleUrl: './lista-tareas.component.scss'
})
export class ListaTareasComponent implements OnInit {
  
  private router = inject(Router);
  private tareaService = inject(TareaService);
  private usuarioService = inject(UsuarioService);
  private sessionService = inject(SessionService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  tareas = signal<Tarea[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.tareaService.listarActivas().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las tareas.');
        this.cargando.set(false);
      }
    });
  }
  irACatalogo(): void {
    this.router.navigate(['/catalogo']);
  }

  abrirDialogoCrearTarea(): void {
    const dialogRef = this.dialog.open(CrearTareaDialogComponent, { width: '450px' });

    dialogRef.afterClosed().subscribe((request: CrearTareaRequest | undefined) => {
      if (request) {
        this.crearTarea(request);
      }
    });
  }

  onEditar(tarea: Tarea): void {
    const dialogRef = this.dialog.open(CrearTareaDialogComponent, {
      width: '450px',
      data: { tarea }
    });

    dialogRef.afterClosed().subscribe((request: EditarTareaRequest | undefined) => {
      if (request) {
        this.editarTarea(tarea.id, request);
      }
    });
  }

  onDesasignar(id: number): void {
    this.tareaService.desasignar(id).subscribe({
      next: (tareaActualizada) => {
        this.actualizarTareaEnLista(tareaActualizada);
        this.snackBar.open('Te has desasignado de la tarea', 'Cerrar', { duration: 3000 });
      },
      error: () => this.mostrarError('No se pudo desasignar la tarea.')
    });
  }

  onEliminar(id: number): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar tarea',
      mensaje: '¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer.',
      textoConfirmar: 'Eliminar',
      textoCancelar: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean | undefined) => {
      if (confirmado) {
        this.eliminarTarea(id);
      }
    });
  }

  private eliminarTarea(id: number): void {
    this.tareaService.eliminar(id).subscribe({
      next: () => {
        this.tareas.update(lista => lista.filter(t => t.id !== id));
        this.snackBar.open('Tarea eliminada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => this.mostrarError('No se pudo eliminar la tarea.')
    });
  }

  private crearTarea(request: CrearTareaRequest): void {
    this.tareaService.crear(request).subscribe({
      next: (tareaCreada) => {
        this.tareas.update(lista => [tareaCreada, ...lista]);
        this.snackBar.open('Tarea creada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => this.mostrarError('No se pudo crear la tarea.')
    });
  }

  private editarTarea(id: number, request: EditarTareaRequest): void {
    this.tareaService.editar(id, request).subscribe({
      next: (tareaActualizada) => {
        this.actualizarTareaEnLista(tareaActualizada);
        this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 3000 });
      },
      error: () => this.mostrarError('No se pudo editar la tarea.')
    });
  }

  onAsignarme(id: number): void {
    this.tareaService.asignarme(id).subscribe({
      next: (tareaActualizada) => this.actualizarTareaEnLista(tareaActualizada),
      error: () => this.mostrarError('No se pudo asignar la tarea.')
    });
  }

  onAsignarACompanero(evento: { tareaId: number; usuarioId: number }): void {
    this.tareaService.asignarA(evento.tareaId, evento.usuarioId).subscribe({
      next: (tareaActualizada) => this.actualizarTareaEnLista(tareaActualizada),
      error: () => this.mostrarError('No se pudo asignar la tarea.')
    });
  }

  onCompletar(id: number): void {
    this.tareaService.completar(id).subscribe({
      next: (tareaActualizada) => {
        this.actualizarTareaEnLista(tareaActualizada);
        this.snackBar.open('Tarea marcada como completada, esperando validación', 'Cerrar', {
          duration: 3000
        });
      },
      error: () => this.mostrarError('No se pudo completar la tarea.')
    });
  }

  onAceptar(id: number): void {
    this.tareaService.aceptar(id).subscribe({
      next: (tareaActualizada) => {
        this.actualizarTareaEnLista(tareaActualizada);
        this.snackBar.open('Tarea validada correctamente', 'Cerrar', { duration: 3000 });
        this.refrescarPuntosUsuarioActual();
      },
      error: () => this.mostrarError('No se pudo validar la tarea.')
    });
  }

  onRechazar(id: number): void {
    this.tareaService.rechazar(id).subscribe({
      next: (tareaActualizada) => {
        this.actualizarTareaEnLista(tareaActualizada);
        this.snackBar.open('Tarea rechazada, vuelve a estar disponible', 'Cerrar', {
          duration: 3000
        });
      },
      error: () => this.mostrarError('No se pudo rechazar la tarea.')
    });
  }

  private refrescarPuntosUsuarioActual(): void {
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (usuario) => this.sessionService.actualizarPuntosUsuarioActual(usuario.matriPuntos),
      error: () => {}
    });
  }

  private actualizarTareaEnLista(tareaActualizada: Tarea): void {
    this.tareas.update(lista =>
      lista.map(t => (t.id === tareaActualizada.id ? tareaActualizada : t))
    );
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}