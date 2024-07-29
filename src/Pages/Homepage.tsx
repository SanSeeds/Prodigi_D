import Navbar from "../components/Global/Navbar";
import { motion } from 'framer-motion';
import Services from "../components/Homepage/ServicesOffered";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.1, duration: 0.5 } 
  }
};



function Homepage() {
  return (
    <>
    <Navbar/>
    <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
      <div id="services-section" className="services-section-wrapper py-12">
        <Services />
      </div>
      </motion.div>
    </>
  );
}

export default Homepage;
