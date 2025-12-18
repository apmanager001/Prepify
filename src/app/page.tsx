import Header from "@/landingPage/comps/header";
import Footer from "@/landingPage/comps/footer";
import Hero from "@/landingPage/hero";
import Action from "@/landingPage/action";
import Mission from "@/landingPage/mission";
import FAQ from "@/landingPage/faq";
import Contact from "@/landingPage/contact";
import Donations from "@/landingPage/donations";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="grow">
        <Hero />
        <div className="relative  z-10 transition-all duration-300 ease-in-out">
          <Action />
        </div>
        <div className="relative -mt-8 z-10 transition-all duration-300 ease-in-out">
          <Mission />
        </div>
        <div className="relative -mt-8 z-10 transition-all duration-300 ease-in-out">
          <FAQ />
        </div>
        <div className="relative -mt-8 z-10 transition-all duration-300 ease-in-out">
          <Donations />
        </div>
        <div className="relative -mt-8 z-10 transition-all duration-300 ease-in-out">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
