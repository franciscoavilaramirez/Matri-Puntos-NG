import { Injectable, signal, computed } from '@angular/core';
import { Usuario, UsuarioHogar } from '../models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _usuarioActual = signal<Usuario | null>(null);
  private _miembrosHogar = signal<UsuarioHogar[]>([]);

  usuarioActual = this._usuarioActual.asReadonly();
  miembrosHogar = this._miembrosHogar.asReadonly();

  companero = computed(() => {
    const actual = this._usuarioActual();
    if (!actual) return null;
    return this._miembrosHogar().find(u => u.id !== actual.id) ?? null;
  });

  setUsuarioActual(usuario: Usuario): void {
    this._usuarioActual.set(usuario);
  }

  setMiembrosHogar(miembros: UsuarioHogar[]): void {
    this._miembrosHogar.set(miembros);
  }

  actualizarPuntosUsuarioActual(puntos: number): void {
    const actual = this._usuarioActual();
    if (actual) {
      this._usuarioActual.set({ ...actual, matriPuntos: puntos });
    }
  }

  limpiar(): void {
    this._usuarioActual.set(null);
    this._miembrosHogar.set([]);
  }
}