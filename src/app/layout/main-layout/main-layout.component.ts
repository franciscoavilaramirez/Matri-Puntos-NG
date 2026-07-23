import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
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

const POLLING_INTERVAL_MS = 20000;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private notificacionService = inject(NotificacionService);
  private router = inject(Router);
  sessionService = inject(SessionService);

  cantidadSinLeer = signal(0);
  notificacionesSinLeer = signal<Notificacion[]>([]);
  cargandoNotificaciones = signal(false);

  private pollingSub?: Subscription;

  ngOnInit(): void {
    this.cargarPerfilYHogar();
    this.iniciarPollingNotificaciones();
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  private cargarPerfilYHogar(): void {
    this.usuarioService.obtenerMiPerfil().subscribe(usuario => {
      this.sessionService.setUsuarioActual(usuario);

      this.usuarioService.listarUsuariosDelHogar(usuario.hogarId).subscribe(miembros => {
        this.sessionService.setMiembrosHogar(miembros);
      });
    });
  }

  private iniciarPollingNotificaciones(): void {
    this.pollingSub = interval(POLLING_INTERVAL_MS)
      .pipe(
        startWith(0),
        switchMap(() => this.notificacionService.contarSinLeer())
      )
      .subscribe(response => {
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

  cerrarSesion(): void {
    this.authService.logout();
    this.sessionService.limpiar();
    this.router.navigate(['/auth/login']);
  }
}