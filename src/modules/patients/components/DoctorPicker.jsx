import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

const selectClass =
  'w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed';

function SelectArrow() {
  return (
    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
      ▼
    </span>
  );
}

function DoctorPicker({ picker, onSearch }) {
  const noDoctors =
    !picker.loading && picker.specialtyId && picker.doctors.length === 0;

  return (
    <Card className="p-6 sm:p-7">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
          Reservar Turno Médico
        </h1>
        <p className="text-xs sm:text-sm text-med-text-sub mt-1">
          Seleccione la especialidad y el profesional para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label
            htmlFor="specialty"
            className="text-xs font-semibold text-med-text-sub"
          >
            Seleccionar Especialidad
          </label>
          <div className="relative">
            <select
              id="specialty"
              value={picker.specialtyId}
              disabled={picker.loading || picker.specialties.length === 0}
              onChange={(e) => picker.setSpecialtyId(e.target.value)}
              className={selectClass}
            >
              {picker.loading && <option>Cargando...</option>}
              {picker.specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label
            htmlFor="doctor"
            className="text-xs font-semibold text-med-text-sub"
          >
            Seleccionar Doctor
          </label>
          <div className="relative">
            <select
              id="doctor"
              value={picker.doctorId}
              disabled={picker.doctors.length === 0}
              onChange={(e) => picker.setDoctorId(e.target.value)}
              className={selectClass}
            >
              {noDoctors && <option>Sin médicos disponibles</option>}
              {picker.doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
        </div>

        <div className="md:col-span-3">
          <Button
            type="button"
            disabled={!picker.selectedDoctor}
            onClick={onSearch}
            className="w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Buscar Disponibilidad</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default DoctorPicker;
