import Header from "@/landingPage/comps/header";
import Footer from "@/landingPage/comps/footer";
import Hero from "@/landingPage/hero";
import Action from "@/landingPage/action";
import Mission from "@/landingPage/mission";
import FAQ from "@/landingPage/faq";
import Contact from "@/landingPage/contact";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
     <Header />
       <main className="flex-grow"> 
        <Hero />
        <Mission />
        <Action />
        <FAQ />
        <Contact />
       </main>
     <Footer />
    </div>
  );
}
