// Responsibility: Synchronize document title and browser favicon with active hospital tenant

import { useEffect } from "react";
import { useHospital } from "@/contexts/useHospital";
import { appConfig } from "@/configs";

export const useHospitalBranding = () => {
  const { currentHospital } = useHospital();

  useEffect(() => {
    if (currentHospital?.name) {
      document.title = `${currentHospital.name} | ${appConfig.name}`;
    } else {
      document.title = appConfig.name;
    }

    const isSafeUrl = (url: string) =>
      /^https?:\/\//i.test(url) || url.startsWith("/");

    if (currentHospital?.logo_url && isSafeUrl(currentHospital.logo_url)) {
      const link =
        (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = currentHospital.logo_url;
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }, [currentHospital]);

  return { currentHospital } as const;
};
