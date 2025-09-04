import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router";

const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      <Link 
        to="/" 
        className="flex items-center hover:text-violet-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          
          {item.href && index !== items.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-violet-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-gray-900 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;