import { Menu } from "lucide-react";
import { Link } from "react-router";
import { getText } from "../../config/texts/texts";

const HomeHeader = ({ children }) => {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Menu className="w-6 h-6 text-violet-900 lg:hidden" />
        <Link to="/" className="text-2xl font-bold text-violet-900">
          {getText("appTitle")}
        </Link>
      </div>
      {children}
      <Link
        to="/professional"
        className="bg-violet-900 hover:bg-violet-800 text-white px-4 py-2 rounded-md hidden sm:block whitespace-nowrap transition-colors"
      >
        {getText("becomeProfessional")}
      </Link>
    </header>
  );
};

export default HomeHeader;
