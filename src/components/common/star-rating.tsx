// This component is no longer used in SkillsSection after the redesign for a minimalist look.
// It can be removed or kept for future use if a different style is desired.
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // number of filled stars
  maxStars?: number;
  starSize?: number;
  className?: string;
}

export default function StarRating({ rating, maxStars = 5, starSize = 20, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }, (_, index) => (
        <Star
          key={index}
          size={starSize}
          className={cn(
            index < rating ? 'text-primary fill-current' : 'text-muted-foreground/50'
          )}
        />
      ))}
    </div>
  );
}
