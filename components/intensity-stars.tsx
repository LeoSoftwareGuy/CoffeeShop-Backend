"use client";

import { StarIcon } from "lucide-react";

interface IntensityStarsProps {
  intensity: number;
}

const IntensityStars: React.FC<IntensityStarsProps> = ({ intensity }) => {
  const stars = [];
  // Generate star icons based on intensityNum
  for (let i = 0; i < intensity; i++) {
    stars.push(<StarIcon key={i} color="#ffbf00" className="w-3 h-3" />);
  }
  return <div className="flex items-center gap-x-2 ">{stars}</div>;
};

export default IntensityStars;
