import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lcwjnwnktohriqbrahh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publisible_kmHNWJu4PHh_f0_USq1x2Q_U0u18p_"; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);