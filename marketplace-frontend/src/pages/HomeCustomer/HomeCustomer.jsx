import React from "react";
import Footer from "../../components/Footer/Footer";
import FindProsessional from "./components/FindProsessional";
import Header from "./components/Header";
import HowItWork from "./components/HowItWork";
import RequestForm from "./components/RequestForm";
import Testimonials from "./components/Testimonials";
import AnnouncementBanner from "../../components/Announcements/AnnouncementBanner";
const HomeCustomer = () => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Announcements Section */}
      <div className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnnouncementBanner page="home" userType="customers" />
        </div>
      </div>
      
      <FindProsessional />
      <HowItWork />
      <RequestForm />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomeCustomer;
