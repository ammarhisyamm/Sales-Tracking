import { Check, CheckCircle } from "lucide-react";

export function DigitalActivityAction({
  completed,
  onComplete,
}: {
  completed: boolean;
  onComplete: () => void;
}) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-500">
        <CheckCircle className="h-3.5 w-3.5" /> Selesai
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onComplete}
      className="inline-flex items-center gap-1.5 rounded-lg bg-[#2953A4] px-3.5 py-2 text-[12px] font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
    >
      <Check className="h-3.5 w-3.5" /> Tandai Selesai
    </button>
  );
}
