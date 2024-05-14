import React from "react";
import { FaCloudUploadAlt, FaShieldAlt, FaBolt } from "react-icons/fa";
import FeatureCard from "@/components/FeatureCard";

const Home: React.FC<{ publicKey: string }> = ({ publicKey }) => {
  const features = [
    {
      title: "Secure Storage",
      description: "Upload your files, media, and data securely with end-to-end encryption.",
      icon: <FaCloudUploadAlt />,
      color: "#11FA98"
    },
    {
      title: "Data Protection",
      description: "Your data is protected with the highest security standards.",
      icon: <FaShieldAlt />,
      color: "#EDF1F9"
    },
    {
      title: "Fast Performance",
      description: "Experience lightning-fast file uploads and downloads.",
      icon: <FaBolt />,
      color: "#A5ACBC"
    },
    
  ];

  return (
    <div className="p-6">
      <main className="container mx-auto">
        <section>
          <h2 className="font-semibold text-lg mb-6 text-gray-400">
            Features
          </h2>
          <div className="flex justify-center gap-4 overflow-x-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
