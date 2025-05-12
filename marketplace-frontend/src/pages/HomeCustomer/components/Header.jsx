import React from "react";
import HomeHeader from "../../../components/Header/HomeHeader";
import { getText } from "../../../config/texts/texts";

const Header = () => {
  return (
    <HomeHeader>
      <nav className="hidden lg:flex items-center gap-8 font-medium">
        <a href="#buscar" className="hover:text-violet-900 transition-colors">
          {getText("findProfessional")}
        </a>
        <a
          href="#presupuesto"
          className="hover:text-violet-900 transition-colors"
        >
          {getText("requestQuote")}
        </a>
        <a
          href="#how-it-works"
          className="hover:text-violet-900 transition-colors"
        >
          {getText("howItWorks")}
        </a>
        <a href="#faq" className="hover:text-violet-900 transition-colors">
          {getText("faq")}
        </a>
      </nav>
    </HomeHeader>
  );
};

export default Header;
