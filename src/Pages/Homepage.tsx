// Homepage.js (or Homepage.tsx if using TypeScript)
import Navbar from "../components/Global/Navbar";
import HeroSection from "../components/Homepage/Jumbotron ";
import Services from "../components/Homepage/ServicesOffered";

function Homepage() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <Navbar/>
      <div className="hero-section-wrapper h-screen flex items-center">
        <HeroSection scrollToServices={scrollToServices} />
      </div>
      <div id="services-section" className="services-section-wrapper py-12">
        <Services />
      </div>
    </>
  );
}

export default Homepage;
