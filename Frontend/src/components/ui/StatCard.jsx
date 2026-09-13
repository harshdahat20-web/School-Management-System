import Card from "./Card.jsx";

const TONES = {
  brand: "bg-violet-100",
  green: "bg-sky-100",
  amber: "bg-emerald-100",
  purple: "bg-amber-100",
};

export default function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  return (
    <Card className={`p-5 border-0 ${TONES[tone]}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center text-white shrink-0">
          <Icon size={16} />
        </div>
        <p className="text-sm text-ink-700 break-words">{label}</p>
      </div>
      <p className="text-3xl font-bold text-ink-900 mt-3">{value}</p>
    </Card>
  );
}
