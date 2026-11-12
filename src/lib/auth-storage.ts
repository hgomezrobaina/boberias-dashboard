/**
 * Storage de sesión para supabase-js, a prueba de relojes desfasados.
 *
 * El problema: GoTrue devuelve en la sesión un `expires_at` (cuándo caduca el
 * access token) calculado con el reloj del *servidor*, pero supabase-js lo
 * compara contra el reloj del *equipo*:
 *
 *     expires_at * 1000 - Date.now() < EXPIRY_MARGIN_MS   // 90 s
 *
 * El access token dura 1 hora, así que si la hora del equipo está adelantada
 * más de ~58 minutos respecto de la hora real (por ejemplo porque se corrigió
 * el horario moviendo el reloj en lugar de cambiar la zona horaria), toda
 * sesión recién emitida nace "caducada". Entonces supabase-js la refresca en
 * cada carga, cada cambio de pestaña y cada tick; el token nuevo también nace
 * caducado, y en cuanto uno de esos refrescos encadenados falla de forma no
 * recuperable (típicamente `Invalid Refresh Token: Already Used`), supabase-js
 * borra la sesión, emite `SIGNED_OUT` y la app manda al login.
 *
 * La corrección: al guardar la sesión se reescribe `expires_at` en términos
 * del reloj local (`ahora + expires_in`). Es la misma convención que usa
 * supabase-js cuando el servidor no manda `expires_at`, así que la cuenta
 * vuelve a ser coherente y el refresco ocurre cuando toca, sin importar qué
 * hora tenga el equipo. Nota: esto arregla la sesión, no el reloj; si la hora
 * del equipo está mal conviene igual corregir la zona horaria del sistema.
 */

/** Marca de qué access token ya tiene su `expires_at` en hora local. */
const LOCAL_EXPIRY_MARKER = "__expiresAtLocalFor";

/** A partir de este desfase se avisa por consola. */
const SKEW_WARNING_SECONDS = 120;

interface StoredSession {
  access_token?: unknown;
  expires_in?: unknown;
  expires_at?: unknown;
  [LOCAL_EXPIRY_MARKER]?: unknown;
}

/** Desfase medido entre el reloj del servidor y el del equipo, en segundos. */
let clockSkewSeconds: number | null = null;

/**
 * Diferencia `servidor - equipo` detectada en el último login o refresco.
 * Positiva: el equipo está atrasado. Negativa: adelantado. `null` si todavía
 * no se pudo medir.
 */
export function getClockSkewSeconds(): number | null {
  return clockSkewSeconds;
}

function isRecord(value: unknown): value is StoredSession {
  return typeof value === "object" && value !== null;
}

/**
 * Pasa `expires_at` al reloj local. Devuelve el valor original si no es una
 * sesión (la misma storage guarda otras claves, como el code verifier de PKCE)
 * o si ya se convirtió para ese token.
 */
function withLocalExpiry(value: string): string {
  let session: unknown;

  try {
    session = JSON.parse(value);
  } catch {
    return value;
  }

  if (!isRecord(session)) return value;

  const { access_token: accessToken, expires_in: expiresIn } = session;

  if (typeof accessToken !== "string" || typeof expiresIn !== "number") {
    return value;
  }

  // Recalcular sobre un token ya convertido le regalaría otra ventana entera
  // de vida, y entonces el refresco llegaría tarde.
  if (session[LOCAL_EXPIRY_MARKER] === accessToken) return value;

  const localExpiresAt = Math.round(Date.now() / 1000) + expiresIn;

  if (typeof session.expires_at === "number") {
    clockSkewSeconds = session.expires_at - localExpiresAt;

    if (Math.abs(clockSkewSeconds) > SKEW_WARNING_SECONDS) {
      console.warn(
        `[auth] La hora de este equipo está desfasada ${Math.round(
          clockSkewSeconds / 60,
        )} minutos respecto del servidor. La sesión se corrigió igual, pero` +
          " conviene arreglar la zona horaria del sistema.",
      );
    }
  }

  return JSON.stringify({
    ...session,
    expires_at: localExpiresAt,
    [LOCAL_EXPIRY_MARKER]: accessToken,
  });
}

export const authStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, withLocalExpiry(value));
    } catch {
      // Modo privado o storage bloqueado: la sesión queda solo en memoria.
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Igual que arriba.
    }
  },
};
