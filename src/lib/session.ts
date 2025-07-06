import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { rootDomain } from "./utils";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type User = {
  userId: string
  expiresAt: Date
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: expiresAt,
    domain: (process.env.NODE_ENV === 'production' && rootDomain.includes('.')) ? '.' + rootDomain : undefined
  });
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function getValidSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value

  let session = null
  console.log(cookie,'this i scookie')
  if (!cookie) {
    return {
      status: false,
      message: 'Session expired, please login again',
      error: null,
      data: null
    }
  }

  session = await decrypt(cookie);


  if (!(session as User)?.userId) {
    return {
      status: false,
      message: 'Session expired, please login again',
      error: null,
      data: null
    }
  }



  return {
    status: true,
    message: 'Session is valid',
    error: null,
    data: session as User
  }
}