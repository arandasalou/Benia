import { createClient } from "@supabase/supabase-js";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.SUPABASE_SECRET_KEY;
if(!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if(!key) throw new Error("Missing SUPABASE_SECRET_KEY");
export const supabaseAdmin=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
