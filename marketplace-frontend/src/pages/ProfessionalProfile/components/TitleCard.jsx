import React from "react";

const TitleCard = ({ title }) => {
  return (
    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6 lg:ml-6">
      {title}
    </h4>
  );
};

export default TitleCard;
