import { Injectable, signal } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Notificacion } from '../models';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client?: Client;
  conectado = signal(false);
  nuevaNotificacion = signal<Notificacion | null>(null);

  conectar(token: string, usuarioId: string): void {
    if (this.client?.active) return;
  
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.wsUrl}?token=${token}`),
      reconnectDelay: 5000,
      onConnect: () => {
        this.conectado.set(true);
        this.client?.subscribe(`/user/${usuarioId}/queue/notificaciones`, (message) => {
          const notificacion: Notificacion = JSON.parse(message.body);
          this.nuevaNotificacion.set(notificacion);
        });
      },
      onDisconnect: () => this.conectado.set(false),
      onStompError: (frame) => console.error('Error STOMP:', frame)
    });
  
    this.client.activate();
  }

  desconectar(): void {
    this.client?.deactivate();
    this.conectado.set(false);
  }
}