import React from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  return (
    <div className="flex flex-col justify-center p-6 rounded-lg shadow-md m-2 w-80" style={{ backgroundColor: color }}>
      <div className="text-4xl text-gray-800 mb-2">{icon}</div>
      <h2 className="text-gray-800 text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
