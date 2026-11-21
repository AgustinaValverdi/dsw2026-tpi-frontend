import Card from '../../shared/components/Card';

function DoctorSelectCard({ doctors, doctorId, onChange }) {
  const doctor = doctors.find((doc) => doc.id === doctorId);

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="doctor"
          className="text-xs font-semibold text-med-text-sub"
        >
          Seleccionar Profesional
        </label>
        <select
          id="doctor"
          value={doctorId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
        >
          <option value="">Elegí un médico...</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
              {doc.specialty?.name ? ` - ${doc.specialty.name}` : ''}
            </option>
          ))}
        </select>
      </div>

      {doctor && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-med-primary-50 border border-med-primary-100">
          <div className="w-11 h-11 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
            🩺
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-med-primary-900 truncate">
              {doctor.name}
            </p>
            <p className="text-xs text-med-text-sub truncate">
              {doctor.specialty?.name}
              {doctor.licenseNumber ? ` • ${doctor.licenseNumber}` : ''}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default DoctorSelectCard;
