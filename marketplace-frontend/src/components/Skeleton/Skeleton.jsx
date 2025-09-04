import clsx from "clsx";

const Skeleton = ({ 
  className = "", 
  variant = "rectangular",
  width = "w-full",
  height = "h-4",
  animation = "pulse"
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded"
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse"
  };

  return (
    <div 
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        width,
        height,
        className
      )}
    />
  );
};

export default Skeleton;