// Interfaccia per l'oggetto utente
export interface User {
  id: string,
  username: string,
  email: string,
  password: string,
}

// Tipo per il payload del token JWT
export interface JwtPayload {
  userId: string
  // Altri campi opzionali relativi al token, se necessario
}
