import Card from '../../shared/components/Card';

function DoctorCard({ doctor }) {
  return (
    <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
      <div className="relative shrink-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
          🩺
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
      </div>
      <div className="overflow-hidden">
        <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
          {doctor.name}
        </h2>
        <p className="text-xs sm:text-sm font-semibold uppercase sm:normal-case tracking-wide sm:tracking-normal text-med-primary-700 sm:text-med-text-sub mt-0.5">
          {doctor.specialty?.name}
        </p>
      </div>
    </Card>
  );
}

export default DoctorCard;
