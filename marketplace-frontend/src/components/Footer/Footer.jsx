import { Sun } from "lucide-react";
const Footer = () => {
  return (
    <footer className="mt-auto bg-violet-800 text-violet-100 py-6 text-center text-sm">
      <p>© 2025 UpProfessional. Todos los derechos reservados.</p>
      <div className="mt-2 flex gap-2 justify-center">
        <Sun className="w-4 h-4" />
        <span>Hecho con pasión</span>
      </div>
    </footer>
  );
};

export default Footer;
