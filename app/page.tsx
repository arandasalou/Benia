import type {Metadata} from "next";
import HomeClient from "@/components/HomeClient";
import {getActiveOffers} from "@/lib/offers";
export const metadata:Metadata={title:"Oportunidades de referidos y promociones en España",description:"Encuentra oportunidades de referidos, fintech, bancos, crypto, cashback, apps y Business disponibles para España.",alternates:{canonical:"/"}};
export default async function HomePage(){const offers=await getActiveOffers();const jsonLd={"@context":"https://schema.org","@graph":[{"@type":"WebSite",name:"BENIA",url:"https://benia.vercel.app/",inLanguage:"es-ES"},{"@type":"WebPage",name:"Oportunidades de referidos y promociones en España",url:"https://benia.vercel.app/",inLanguage:"es-ES"}]};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><HomeClient offers={offers}/></>;}
