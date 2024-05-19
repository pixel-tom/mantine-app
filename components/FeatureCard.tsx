import { Card, Text } from "@mantine/core";
import React, { FC } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  color: string;
  bgColor: string;
};

const FeatureCard: FC<FeatureCardProps> = ({
  title,
  description,
  color,
  bgColor,
}) => {
  return (
    <Card radius="md" withBorder bg={`${bgColor}`}>
      <div>
        <Text size="lg" fw={700} c={`${color}`}>
          {title}
        </Text>
        <Text size="sm" c={`${color}`}>
          {description}
        </Text>
      </div>
    </Card>
  );
};

export default FeatureCard;
