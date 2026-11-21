import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import SearchInput from '../../shared/components/SearchInput';
import TablePagination from '../../shared/components/TablePagination';
import ConfirmDialog from '../../shared/components/ConfirmDialog';
import TableMessageRow from '../../shared/components/TableMessageRow';
import DeleteIconButton from '../../shared/components/DeleteIconButton';
import ErrorBanner from '../../shared/components/ErrorBanner';
import useDebouncedValue from '../../shared/hooks/useDebouncedValue';
import usePagedList from '../../shared/hooks/usePagedList';
import useDeleteAction from '../../shared/hooks/useDeleteAction';
import { getInitials } from '../../shared/helpers/initials';
import { deleteDoctor, getAdminDoctors } from '../services/doctorService';

const removeDoctor = (doctor) => deleteDoctor(doctor.id);

function DoctorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const name = useDebouncedValue(search);
  const list = usePagedList(getAdminDoctors, { params: { name } });
  const deletion = useDeleteAction(removeDoctor, {
    onDone: list.reload,
    failMessage: 'No se pudo eliminar el médico.',
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar doctor por nombre..."
            className="min-w-[220px] flex-1 sm:flex-initial"
          />
          <Button onClick={() => navigate('/admin/availability')}>
            Agregar Disponibilidad Horaria
          </Button>
          <Button onClick={() => navigate('/admin/doctors/new')}>
            + Nuevo Doctor
          </Button>
        </div>
      </div>

      <ErrorBanner>{list.error}</ErrorBanner>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {list.loading && (
                <TableMessageRow colSpan={4}>
                  Cargando médicos...
                </TableMessageRow>
              )}
              {!list.loading && list.items.length === 0 && (
                <TableMessageRow colSpan={4}>
                  {name
                    ? 'No hay médicos que coincidan con la búsqueda.'
                    : 'Todavía no hay médicos cargados.'}
                </TableMessageRow>
              )}
              {!list.loading &&
                list.items.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-900 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(doctor.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-med-text-muted">
                            Matrícula: {doctor.licenseNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                        {doctor.specialty?.name || 'Sin especialidad'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          doctor.deleted
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-med-active-bg text-med-active-text'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {doctor.deleted ? 'Inactivo' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!doctor.deleted && (
                        <DeleteIconButton
                          label={`Dar de baja a ${doctor.name}`}
                          onClick={() => deletion.request(doctor)}
                        />
                      )}
                    </td>
                  </tr>
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

      {deletion.target && (
        <ConfirmDialog
          title="¿Eliminar este médico?"
          confirmLabel="Sí, eliminar"
          busyLabel="Eliminando..."
          busy={deletion.busy}
          error={deletion.error}
          onConfirm={deletion.confirm}
          onCancel={deletion.cancel}
        >
          <p>
            <strong className="text-med-text-main">
              {deletion.target.name}
            </strong>{' '}
            quedará marcado como inactivo en el directorio y no podrá recibir
            nuevas reservas. Sus turnos futuros quedarán cancelados y el
            historial se conservará.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default DoctorsPage;
