export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegistroRequest {
    nombre: string;
    email: string;
    password: string;
    nombreHogar?: string;
    codigoInvitacion?: string;
  }
  
  export interface AuthResponse {
    token: string;
    usuarioId: number;
    nombre: string;
    hogarId: number;
    codigoInvitacionHogar: string;
  }