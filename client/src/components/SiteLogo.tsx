import { cn } from "@/lib/utils";
import { SITE_LOGO_PATH, SITE_NAME } from "@shared/constants";
import { useState } from "react";

type SiteLogoProps = {
  className?: string;
  imgClassName?: string;
};

/**
 * شعار الموقع من `client/public` — استبدل الملف المشار إليه في `SITE_LOGO_PATH` بشعارك.
 */
export default function SiteLogo({ className, imgClassName }: SiteLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-lg font-bold text-white",
          className
        )}
        aria-hidden
      >
        GB
      </div>
    );
  }

  return (
    <img
      src={SITE_LOGO_PATH}
      alt={SITE_NAME}
      className={cn(
        "h-10 w-auto max-h-10 max-w-[min(100%,220px)] object-contain object-left",
        imgClassName,
        className
      )}
      onError={() => setUseFallback(true)}
    />
  );
}
