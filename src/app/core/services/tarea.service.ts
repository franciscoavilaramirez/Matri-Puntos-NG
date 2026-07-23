import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarea, CrearTareaRequest, EditarTareaRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tareas`;

  listarActivas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  listarCatalogo(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.apiUrl}/catalogo`);
  }

  crear(request: CrearTareaRequest): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, request);
  }

  activar(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/activar`, {});
  }

  asignarme(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/asignarme`, {});
  }

  asignarA(id: number, usuarioId: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/asignar/${usuarioId}`, {});
  }

  completar(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/completar`, {});
  }

  aceptar(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/aceptar`, {});
  }

  rechazar(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/rechazar`, {});
  }
  editar(id: number, request: EditarTareaRequest): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, request);
  }
  
  desasignar(id: number): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}/desasignar`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}