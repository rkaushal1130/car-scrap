import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ count = 5 }) => {
  return (
    <div className="flex gap-1 text-amber-500 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-500" />
      ))}
    </div>
  );
};
