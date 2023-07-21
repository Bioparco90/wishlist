import { Request } from "express";

// Interfaccia per l'oggetto utente
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

// Tipo per il payload del token JWT
export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload; // Aggiungi la proprietà "user" al tipo Request
}
