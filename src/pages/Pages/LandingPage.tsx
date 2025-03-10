import React, { useState } from 'react';
import Navbar from '../../components/LandingPage/Navbar/index.jsx';
import HeroArea from '../../components/LandingPage/HeroArea.jsx';
import Services from '../../components/LandingPage/Services.jsx';
import Video from '../../components/LandingPage/Video.jsx';
// import PricingPlans from '../../components/LandingPage/PricingPlans.jsx';
import Team from '../../components/LandingPage/Team.jsx';
import Faq from '../../components/LandingPage/Faq.jsx';
import Cta from '../../components/LandingPage/Cta.jsx';
import Testimonials from '../../components/LandingPage/Testimonials.jsx';
import ContactUs from '../../components/LandingPage/ContactUs.jsx';

// import DarkModeToggle from "../../components/LandingPage/DarkModeToggle.jsx";
import Footer from '../../components/LandingPage/Footer/index.jsx';

const LandingPage: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <Navbar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />

      <HeroArea />
      <Services />
      <Video />
      {/* <PricingPlans /> */}
      <Team />
      <Faq />
      <Cta />
      <Testimonials />
      <ContactUs />

      <Footer />
      {/* <DarkModeToggle /> */}
    </>
  );
};
export default LandingPage;
