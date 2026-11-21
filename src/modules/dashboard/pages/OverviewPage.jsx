import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import SearchInput from '../../shared/components/SearchInput';
import TablePagination from '../../shared/components/TablePagination';
import TableMessageRow from '../../shared/components/TableMessageRow';
import ErrorBanner from '../../shared/components/ErrorBanner';
import useDebouncedValue from '../../shared/hooks/useDebouncedValue';
import usePagedList from '../../shared/hooks/usePagedList';
import { getInitials } from '../../shared/helpers/initials';
import { getDoctors } from '../../doctors/services/doctorService';
import StatCard from '../components/StatCard';
import useDashboardStats from '../hooks/useDashboardStats';

const DOCTORS_ICON =
  'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10';
const SPECIALTIES_ICON =
  'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z';
const CALENDAR_ICON =
  'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';

function OverviewPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const name = useDebouncedValue(search);
  const { stats, error: statsError } = useDashboardStats();
  const doctors = usePagedList(getDoctors, { params: { name }, pageSize: 5 });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista General de Gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/admin/doctors/new')}>
            + Agregar Nuevo Doctor
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties/new')}
          >
            + Agregar Nueva Especialidad
          </Button>
        </div>
      </div>

      <ErrorBanner>{statsError || doctors.error}</ErrorBanner>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          label="Doctores activos"
          value={stats.doctors}
          icon={DOCTORS_ICON}
        />
        <StatCard
          label="Especialidades activas"
          value={stats.specialties}
          icon={SPECIALTIES_ICON}
        />
        <StatCard
          label="Turnos confirmados para hoy"
          value={stats.today}
          badge="Hoy"
          icon={CALENDAR_ICON}
        />
      </div>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-med-primary-900">
            Directorio de Profesionales Médicos
          </h2>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre..."
            className="sm:w-60"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {doctors.loading && (
                <TableMessageRow colSpan={3}>
                  Cargando médicos...
                </TableMessageRow>
              )}
              {!doctors.loading && doctors.items.length === 0 && (
                <TableMessageRow colSpan={3}>
                  No hay médicos para mostrar.
                </TableMessageRow>
              )}
              {!doctors.loading &&
                doctors.items.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-med-primary-100 text-med-primary-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(doctor.name)}
                        </div>
                        <span className="font-semibold text-med-primary-900">
                          {doctor.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-med-text-sub">
                      {doctor.specialty?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate('/admin/doctors')}
                        className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 hover:underline"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={doctors.page}
          totalPages={doctors.totalPages}
          totalItems={doctors.total}
          pageSize={doctors.pageSize}
          onPageChange={doctors.setPage}
        />
      </Card>
    </div>
  );
}

export default OverviewPage;
