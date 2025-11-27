import { Moon, Sun, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const PumpkinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ff9800"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[1.2rem] w-[1.2rem]"
  >
    {/* Stem */}
    <path d="M12 2 L12 5" />
    <path d="M11 4 Q10 3 9 4" />

    {/* Pumpkin body */}
    <ellipse cx="12" cy="14" rx="8" ry="7" fill="#ff9800" fillOpacity="0.3" />

    {/* Vertical segments */}
    <path d="M12 7 Q12 10 12 21" />
    <path d="M8 8 Q7.5 11 8 20" />
    <path d="M16 8 Q16.5 11 16 20" />

    {/* Eyes */}
    <path d="M9 12 L10 13 L9 14 Z" fill="#ff9800" />
    <path d="M15 12 L14 13 L15 14 Z" fill="#ff9800" />

    {/* Mouth */}
    <path d="M9 16 Q12 18 15 16" />
  </svg>
);

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-foreground" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] transition-all text-foreground" />;
      case "christmas":
        return <TreePine className="h-[1.2rem] w-[1.2rem] transition-all" style={{ stroke: "#388e3c" }} />;
      case "halloween":
        return <PumpkinIcon />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-foreground" />;
    }
  };

  const getAriaLabel = () => {
    switch (theme) {
      case "light":
        return "현재 라이트 모드 (클릭하여 다크 모드로 전환)";
      case "dark":
        return "현재 다크 모드 (클릭하여 크리스마스 테마로 전환)";
      case "christmas":
        return "현재 크리스마스 테마 (클릭하여 할로윈 테마로 전환)";
      case "halloween":
        return "현재 할로윈 테마 (클릭하여 라이트 모드로 전환)";
      default:
        return "테마 전환";
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={getAriaLabel()}
      className="relative"
    >
      {getIcon()}
    </Button>
  );
};
