import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'default-secret-change-me'
);

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'ORGANIZER' | 'ATTENDEE';
  avatar?: string | null;
}

export async function createSession(user: UserSession): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifySession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as UserSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  return verifySession(token);
}

export async function login(email: string, password: string): Promise<{ user: UserSession; token: string } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };

  const token = await createSession(session);
  
  return { user: session, token };
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: 'ORGANIZER' | 'ATTENDEE'
): Promise<{ user: UserSession; token: string } | null> {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) return null;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  const session: UserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  };

  const token = await createSession(session);
  
  return { user: session, token };
}