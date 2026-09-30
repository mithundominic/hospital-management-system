// Responsibility: Top-level public homepage container assembling landing sections

import { Box } from "@/components/ui/Box";
import { HomeNavbar } from "./components/HomeNavbar";
import { HomeHero } from "./components/HomeHero";
import { HomeHeroMetrics } from "./components/HomeHeroMetrics";
import { HomeModules } from "./components/HomeModules";
import { HomeFeatures } from "./components/HomeFeatures";
import { HomeCta } from "./components/HomeCta";
import { HomeFooter } from "./components/HomeFooter";

export const HomePage = () => {
  return (
    <Box className="min-h-screen bg-white flex flex-col">
      <HomeNavbar />
      <Box className="flex-1">
        <HomeHero />
        <HomeHeroMetrics />
        <HomeModules />
        <HomeFeatures />
        <HomeCta />
      </Box>
      <HomeFooter />
    </Box>
  );
};

export default HomePage;
