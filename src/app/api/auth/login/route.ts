import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

// Simulación de usuarios para desarrollo
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '123456',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '123456',
    name: 'Regular User',
    role: 'user',
  },
  {
    id: '3',
    email: 'demo@adam-pro.com',
    password: 'demo123',
    name: 'Demo User',
    role: 'admin',
  },
];

// Función para generar un JWT simple (solo para desarrollo)
function generateMockJWT(user: any) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = btoa('mock-signature-for-development');

  return `${header}.${payload}.${signature}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // Buscar usuario en la lista mock
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Generar tokens
    const accessToken = generateMockJWT(user);
    const idToken = generateMockJWT(user); // Mismo token para desarrollo

    // Respuesta compatible con AuthStore
    return NextResponse.json({
      access_token: accessToken, // AuthStore espera access_token
      id_token: idToken, // AuthStore espera id_token
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Login exitoso',
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
