import { useState } from 'react';
import Card from '../../shared/components/Card';
import TablePagination from '../../shared/components/TablePagination';
import TableMessageRow from '../../shared/components/TableMessageRow';
import ErrorBanner from '../../shared/components/ErrorBanner';
import usePagedList from '../../shared/hooks/usePagedList';
import AppointmentFilters from '../components/AppointmentFilters';
import AppointmentRow from '../components/AppointmentRow';
import useSearchOptions from '../hooks/useSearchOptions';
import { EMPTY_FILTERS } from '../helpers/filters';
import { searchAppointments } from '../services/appointmentSearchService';

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const options = useSearchOptions();
  const list = usePagedList(searchAppointments, { params: filters });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-bold text-med-primary-900 pb-4 border-b border-med-border-subtle">
          Criterios de Búsqueda
        </h2>
        <AppointmentFilters
          applied={filters}
          specialties={options.specialties}
          doctors={options.doctors}
          onApply={setFilters}
        />
      </Card>

      <ErrorBanner>{options.error || list.error}</ErrorBanner>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Fecha</th>
                <th className="px-6 py-3.5">Departamento</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {list.loading && (
                <TableMessageRow colSpan={4}>Buscando citas...</TableMessageRow>
              )}
              {!list.loading && list.items.length === 0 && (
                <TableMessageRow colSpan={4}>
                  No hay citas para esos criterios.
                </TableMessageRow>
              )}
              {!list.loading &&
                list.items.map((appt) => (
                  <AppointmentRow key={appt.id} appointment={appt} />
                ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={list.page}
          totalPages={list.totalPages}
          totalItems={list.total}
          pageSize={list.pageSize}
          onPageChange={list.setPage}
        />
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
