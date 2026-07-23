import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notificacion } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly apiUrl = `${environment.apiUrl}/notificaciones`;

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  listarSinLeer(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/sin-leer`);
  }

  contarSinLeer(): Observable<{ cantidad: number }> {
    return this.http.get<{ cantidad: number }>(`${this.apiUrl}/contar-sin-leer`);
  }

  marcarLeida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/marcar-leida`, {});
  }
}