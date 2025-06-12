import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// Función para decodificar el JWT mock (solo para desarrollo)
function decodeMockJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const payload = JSON.parse(atob(parts[1]));

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expirado');
    }

    return payload;
  } catch {
    throw new Error('Token inválido');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token de autorización requerido' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Decodificar y validar token
    const payload = decodeMockJWT(token);

    // Respuesta con información del usuario
    return NextResponse.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        displayName: payload.name, // Alias para compatibilidad
        photoURL: null, // Placeholder para foto de perfil
      },
    });
  } catch (error) {
    console.error('Error en verificación de token:', error);
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }
}
