// Responsibility: Render a responsive grid of metric KPI cards with integrated loading skeleton support

import type { ElementType, ReactNode } from "react";
import { Grid, type GridProps } from "@/components/ui/Grid";
import { StatCard } from "./StatCard";
import { SkeletonStatCard } from "./SkeletonCard";

export interface StatItemConfig {
  key?: string;
  label: string;
  value: string | number;
  subtext?: ReactNode;
  icon: ElementType;
  iconColor?: string;
  valueColor?: string;
  cardPadding?: string;
}

export interface StatCardGridProps {
  stats: readonly StatItemConfig[] | StatItemConfig[];
  cols?: GridProps["cols"];
  gap?: GridProps["gap"];
  isLoading?: boolean;
  skeletonCount?: number;
}

export const StatCardGrid = ({
  stats,
  cols = 4,
  gap = 6,
  isLoading = false,
  skeletonCount,
}: StatCardGridProps) => {
  const count = skeletonCount || (typeof cols === "number" ? cols : 4);

  if (isLoading) {
    return (
      <Grid cols={cols} gap={gap}>
        {Array.from({ length: count }).map((_, idx) => (
          <SkeletonStatCard key={idx} />
        ))}
      </Grid>
    );
  }

  return (
    <Grid cols={cols} gap={gap}>
      {stats.map((s, idx) => (
        <StatCard
          key={s.key || s.label || idx}
          label={s.label}
          value={s.value}
          subtext={s.subtext}
          icon={s.icon}
          iconColor={s.iconColor}
          valueColor={s.valueColor}
          cardPadding={s.cardPadding || "p-6"}
        />
      ))}
    </Grid>
  );
};

export default StatCardGrid;
