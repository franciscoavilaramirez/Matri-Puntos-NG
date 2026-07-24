import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hogar } from '../models/hogar.model';

@Injectable({ providedIn: 'root' })
export class HogarService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/hogar`;

  obtenerInfo(): Observable<Hogar> {
    return this.http.get<Hogar>(`${this.baseUrl}/info`);
  }
}