import clsx from "clsx";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "sm", 
  className = "",
  icon = null 
}) => {
  const baseClasses = "inline-flex items-center gap-1 font-medium rounded-full border";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    verified: "bg-violet-100 text-violet-800 border-violet-200",
    available: "bg-green-100 text-green-800 border-green-200",
    urgent: "bg-red-100 text-red-800 border-red-200"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    )}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;