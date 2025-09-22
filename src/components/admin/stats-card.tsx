import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  testId?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  onClick,
  testId
}: StatsCardProps) {
  return (
    <Card 
      className={`p-6 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      data-testid={testId}
    >
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className={`p-2 ${iconBgColor} rounded-lg`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}