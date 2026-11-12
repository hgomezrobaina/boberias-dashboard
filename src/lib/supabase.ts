import { createClient } from "@supabase/supabase-js";
import { SUPABASE_API_KEY } from "./env";
import { authStorage } from "./auth-storage";

const supabaseUrl = "https://vpkgbllibugkedncqicr.supabase.co";
const supabaseKey = SUPABASE_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  // `authStorage` normaliza el vencimiento de la sesión al reloj del equipo,
  // para que una hora mal configurada no termine expulsando al login.
  auth: { storage: authStorage },
});
