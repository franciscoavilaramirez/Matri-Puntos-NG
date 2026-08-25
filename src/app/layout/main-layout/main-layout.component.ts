import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import confetti from 'canvas-confetti';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SessionService } from '../../core/services/session.service';
import { Notificacion } from '../../core/models';
import { WebSocketService } from '../../core/services/websocket.service';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);
  private webSocketService = inject(WebSocketService);

  sessionService = inject(SessionService);

  cantidadSinLeer = signal(0);
  notificacionesSinLeer = signal<Notificacion[]>([]);
  cargandoNotificaciones = signal(false);


  constructor() {
    effect(() => {
      const notif = this.webSocketService.nuevaNotificacion();
      if (notif) {
        this.notificacionesSinLeer.update(lista => [notif, ...lista]);
        this.cantidadSinLeer.update(n => n + 1);

        if (notif.tipo === 'TAREA_VALIDADA') {
          this.lanzarConfeti();
        }
      }
    });
  }


  ngOnInit(): void {
    this.cargarPerfilYHogar();
    const token = this.authService.getToken();
    const usuarioId = this.sessionService.usuarioActual()?.id;
    if (token && usuarioId) {
      this.webSocketService.conectar(token, usuarioId.toString());
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.desconectar();
  }

  private cargarPerfilYHogar(): void {
    this.usuarioService.obtenerMiPerfil()
      .pipe(
        tap(usuario => {
          this.sessionService.setUsuarioActual(usuario);
        }),
        switchMap(usuario =>
          this.usuarioService.listarUsuariosDelHogar(usuario.hogarId)
        )
      )
      .subscribe(miembros => {
        this.sessionService.setMiembrosHogar(miembros);
        this.cargarConteoInicial(); // solo una vez al cargar, no polling continuo
      });
  }
  private cargarConteoInicial(): void {
    this.notificacionService.contarSinLeer().subscribe(response => {
      this.cantidadSinLeer.set(response.cantidad);
    });
  }

  abrirPanelNotificaciones(): void {
    this.cargandoNotificaciones.set(true);
    this.notificacionService.listarSinLeer().subscribe({
      next: (notificaciones) => {
        this.notificacionesSinLeer.set(notificaciones);
        this.cargandoNotificaciones.set(false);
      },
      error: () => this.cargandoNotificaciones.set(false)
    });
  }

  seleccionarNotificacion(notificacion: Notificacion): void {
    this.notificacionService.marcarLeida(notificacion.id).subscribe(() => {
      this.notificacionesSinLeer.update(lista =>
        lista.filter(n => n.id !== notificacion.id)
      );
      this.cantidadSinLeer.update(c => Math.max(0, c - 1));

      if (notificacion.tareaId) {
        this.router.navigate(['/tareas', notificacion.tareaId]);
      }
    });
  }
private lanzarConfeti(): void {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98']
    });
    // Segunda ráfaga con un pequeño delay para efecto más festivo
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 }
      });
    }, 250);
  }
  cerrarSesion(): void {
    this.authService.logout();
    this.sessionService.limpiar();
    this.router.navigate(['/auth/login']);
  }
}