import { cn } from "@/lib/utils";

type FoodType = "tomato" | "carrot" | "leaf" | "onion" | "pepper" | "mushroom" | "avocado" | "lemon";

interface FoodIllustrationProps {
  type: FoodType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const foodPaths: Record<FoodType, { path: string; viewBox: string; color: string }> = {
  tomato: {
    viewBox: "0 0 100 100",
    color: "stroke-calm-red",
    path: "M50 15 C45 10 40 12 42 18 M58 18 C60 12 55 10 50 15 M50 20 C25 20 15 45 15 60 C15 80 30 90 50 90 C70 90 85 80 85 60 C85 45 75 20 50 20 Z M35 45 Q40 55 35 65 M55 40 Q60 55 55 70"
  },
  carrot: {
    viewBox: "0 0 100 100",
    color: "stroke-calm-red-light",
    path: "M50 15 C45 12 40 15 45 20 M55 20 C60 15 55 12 50 15 M50 20 L50 25 M40 25 C30 30 25 45 30 90 L50 85 L70 90 C75 45 70 30 60 25 Z M40 45 L55 50 M45 60 L60 65 M42 75 L55 78"
  },
  leaf: {
    viewBox: "0 0 100 100",
    color: "stroke-sage",
    path: "M50 90 L50 50 M50 50 C20 50 15 25 50 10 C85 25 80 50 50 50 M50 35 C40 35 35 28 50 20 C65 28 60 35 50 35 M35 55 Q50 45 65 55"
  },
  onion: {
    viewBox: "0 0 100 100",
    color: "stroke-warm-grey",
    path: "M50 10 L50 25 M50 25 C30 30 20 50 25 70 C30 85 50 90 50 90 C50 90 70 85 75 70 C80 50 70 30 50 25 Z M35 45 Q50 35 65 45 M32 60 Q50 48 68 60 M35 75 Q50 65 65 75"
  },
  pepper: {
    viewBox: "0 0 100 100",
    color: "stroke-sage-dark",
    path: "M50 10 C48 15 45 18 45 22 L55 22 C55 18 52 15 50 10 M45 22 C30 25 20 45 25 70 C28 85 45 90 50 90 C55 90 72 85 75 70 C80 45 70 25 55 22 M40 50 Q50 45 60 50 M38 70 Q50 62 62 70"
  },
  mushroom: {
    viewBox: "0 0 100 100",
    color: "stroke-charcoal/60",
    path: "M50 50 L45 90 L55 90 L50 50 M50 50 C20 50 10 30 50 15 C90 30 80 50 50 50 M30 40 A5 5 0 1 0 30 41 M45 30 A4 4 0 1 0 45 31 M65 35 A6 6 0 1 0 65 36"
  },
  avocado: {
    viewBox: "0 0 100 100",
    color: "stroke-sage",
    path: "M50 10 C30 15 20 35 25 60 C30 80 45 90 50 90 C55 90 70 80 75 60 C80 35 70 15 50 10 Z M50 50 A15 18 0 1 0 50 51 M50 55 A8 10 0 1 0 50 56"
  },
  lemon: {
    viewBox: "0 0 100 100",
    color: "stroke-nutrient-carbs",
    path: "M50 15 C55 12 58 15 55 20 M50 20 C25 25 15 45 20 65 C25 85 45 90 50 88 C55 90 75 85 80 65 C85 45 75 25 50 20 Z M35 50 L50 55 L65 50 M40 65 L50 60 L60 65"
  }
};

export function FoodIllustration({ type, className, size = "md" }: FoodIllustrationProps) {
  const { path, viewBox, color } = foodPaths[type];
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <svg
      viewBox={viewBox}
      className={cn(
        sizeClasses[size],
        color,
        "fill-none stroke-2 opacity-60",
        className
      )}
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
