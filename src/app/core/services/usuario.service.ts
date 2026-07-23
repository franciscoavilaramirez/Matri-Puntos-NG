import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioHogar } from '../models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
  private readonly hogarUrl = `${environment.apiUrl}/hogar`;


  constructor(private http: HttpClient) {}

  obtenerMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }
  listarUsuariosDelHogar(hogarId: number): Observable<UsuarioHogar[]> {
    return this.http.get<UsuarioHogar[]>(`${this.hogarUrl}/${hogarId}/usuarios`);
  }
}