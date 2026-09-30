import { GlobeSimple, MapPin } from "@phosphor-icons/react";

export function ActivityKindBadge({ kind }: { kind: "digital" | "lapangan" }) {
  const isDigital = kind === "digital";
  const Icon = isDigital ? GlobeSimple : MapPin;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        isDigital ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-[#2953A4]"
      }`}
    >
      <Icon size={13} weight="regular" />
      {isDigital ? "Digital" : "Lapangan"}
    </span>
  );
}
