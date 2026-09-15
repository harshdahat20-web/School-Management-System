import { GraduationCap } from "lucide-react";

export default function Logo({ dark = false, size = "md" }) {
  const textColor = dark ? "text-sidebar-text" : "text-ink-900";
  const subColor = dark ? "text-sidebar-muted" : "text-ink-500";
  const iconSize = size === "lg" ? 40 : 22;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-lg ${
          size === "lg" ? "w-14 h-14" : "w-8 h-8"
        } bg-brand-500 text-white shrink-0`}
      >
        <GraduationCap size={iconSize} strokeWidth={2} />
      </div>
      <div className="leading-tight">
        <p
          className={`font-bold ${size === "lg" ? "text-2xl" : "text-sm"} ${textColor}`}
        >
          {size === "lg" ? "School Management System" : "SchoolMS"}
        </p>
        {size === "lg" ? (
          <p className={`text-xs tracking-wide ${subColor} mt-0.5`}>
            Better Education &nbsp;•&nbsp; Brighter Future
          </p>
        ) : (
          <p className={`text-[11px] ${subColor}`}>School Management System</p>
        )}
      </div>
    </div>
  );
}
