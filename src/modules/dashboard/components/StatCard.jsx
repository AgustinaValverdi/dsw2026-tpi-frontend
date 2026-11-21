import Card from '../../shared/components/Card';

function StatCard({ label, value, badge, icon }) {
  return (
    <Card className="p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d={icon}
            />
          </svg>
        </div>
        {badge && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-med-primary-100 text-med-primary-700">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
          {label}
        </p>
        <p className="text-3xl font-bold text-med-primary-900 mt-1">
          {value ?? '–'}
        </p>
      </div>
    </Card>
  );
}

export default StatCard;
