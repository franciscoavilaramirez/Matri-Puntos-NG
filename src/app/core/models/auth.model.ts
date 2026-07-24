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
  export interface OlvidePasswordRequest {
    email: string;
  }
  
  export interface ResetearPasswordRequest {
    token: string;
    passwordNueva: string;
    passwordNuevaConfirmacion: string;
  }
  
  export interface MensajeResponse {
    mensaje: string;
  }