// Homepage.js (or Homepage.tsx if using TypeScript)
import Navbar from "../components/Global/Navbar";

import Services from "../components/Homepage/ServicesOffered";

function Homepage() {
  return (
    <>
    <Navbar/>
      <div id="services-section" className="services-section-wrapper py-12">
        <Services />
      </div>
    </>
  );
}

export default Homepage;
