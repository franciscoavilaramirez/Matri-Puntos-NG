import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../../core/services/session.service';
import { Tarea } from '../../../core/models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);

  tarea = input.required<Tarea>();

  asignarme = output<number>();
  asignarACompanero = output<{ tareaId: number; usuarioId: number }>();
  completar = output<number>();
  aceptar = output<number>();
  rechazar = output<number>();
  editar = output<Tarea>();
  eliminar = output<number>();
  desasignar = output<number>();


  private usuarioId = this.authService.getUsuarioId();

  companero = this.sessionService.companero;

  esMia = computed(() => this.tarea().asignadoAId === this.usuarioId);
  esDePareja = computed(() =>
    this.tarea().asignadoAId !== null && this.tarea().asignadoAId !== this.usuarioId
  );
  sinAsignar = computed(() => this.tarea().asignadoAId === null);
  enValidacion = computed(() => this.tarea().estado === 'EN_VALIDACION');

  puedeCompletar = computed(() => this.esMia() && this.tarea().estado === 'PENDIENTE');
  puedeValidar = computed(() => this.enValidacion() && !this.esMia());
  puedeDesasignar = computed(() => this.esMia() && this.tarea().estado === 'PENDIENTE');


  // Solo se pueden editar/eliminar/reasignar tareas PENDIENTE (no en validación)
  puedeGestionar = computed(() => this.tarea().estado === 'PENDIENTE');

  cardClass = computed(() => {
    if (this.enValidacion()) return 'card-validacion';
    if (this.esMia()) return 'card-mia';
    if (this.esDePareja()) return 'card-pareja';
    return 'card-disponible';
  });

  onAsignarme(): void {
    this.asignarme.emit(this.tarea().id);
  }

  onAsignarACompanero(): void {
    const comp = this.companero();
    if (comp) {
      this.asignarACompanero.emit({ tareaId: this.tarea().id, usuarioId: comp.id });
    }
  }

  onCompletar(): void {
    this.completar.emit(this.tarea().id);
  }

  onAceptar(): void {
    this.aceptar.emit(this.tarea().id);
  }

  onRechazar(): void {
    this.rechazar.emit(this.tarea().id);
  }

  onEditar(): void {
    this.editar.emit(this.tarea());
  }
  
  onDesasignar(): void {
    this.desasignar.emit(this.tarea().id);
  }

  onEliminar(): void {
    this.eliminar.emit(this.tarea().id);
  }
}