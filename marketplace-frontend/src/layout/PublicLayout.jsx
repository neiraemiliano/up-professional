import React from "react";
import { Outlet } from "react-router";
import HomeHeader from "../components/Header/HomeHeader";
import Footer from "../components/Footer/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
