import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lcwjnwnktohriqbrahh.supabase.co";
// Reemplaza los puntos suspensivos con tu token JWT real de Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);