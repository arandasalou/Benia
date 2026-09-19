import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
export type Offer={id:number;brand:string;category:string;icon:string|null;title:string;reward:string;description:string|null;referral_url:string;conditions:unknown;verified:boolean|null;source_type:string|null;score:number|null;expires_at:string|null;active:boolean|null;created_at?:string|null;updated_at?:string|null};
export function getConditions(v:unknown):string[]{if(Array.isArray(v))return v.filter((x):x is string=>typeof x==="string");if(typeof v==="string"&&v.trim())return [v];return [];}
export async function getActiveOffers():Promise<Offer[]>{const {data,error}=await supabase.from("offers").select("*").eq("active",true).order("score",{ascending:false,nullsFirst:false}).order("brand",{ascending:true});if(error){console.error(error);return [];}return (data??[]) as Offer[];}
export async function getOfferBySlug(slug:string){const offers=await getActiveOffers();return offers.find(o=>slugify(o.brand)===slug)??null;}
export function formatDate(v:string|null|undefined){if(!v)return null;const d=new Date(v);if(Number.isNaN(d.getTime()))return null;return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"long",year:"numeric",timeZone:"Europe/Madrid"}).format(d);}
