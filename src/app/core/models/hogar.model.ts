export interface Miembro {
    id: number;
    nombre: string;
    matriPuntos: number;
  }
  
  export interface Hogar {
    id: number;
    nombre: string;
    codigoInvitacion: string;
    miembros: Miembro[];
  }