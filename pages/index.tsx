import React from "react";
import FeatureCard from "@/components/FeatureCard";

function Home() {
  const features = [
    {
      title: "Secure Storage",
      description: "Upload your files, media, and data securely with end-to-end encryption.",
      color: "#f5f5f5",
      bgColor: "#181c20",
    },
    {
      title: "Data Protection",
      description: "Your data is protected with the highest security standards.",
      color: "#1b1b1b",
      bgColor: "#11FA98",
    },
  ];

  return (
    <div className="p-6">
      <main className="container">
        <section>
          <h2 className="font-semibold text-lg mb-6 text-gray-400">
            Features
          </h2>
          <div className="flex justify-center gap-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                bgColor={feature.bgColor}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
