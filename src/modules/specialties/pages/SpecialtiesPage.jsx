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
import {
  deleteSpecialty,
  getSpecialtiesPage,
} from '../services/specialtyService';

const removeSpecialty = (specialty) => deleteSpecialty(specialty.id);

function SpecialtiesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const name = useDebouncedValue(search);
  const list = usePagedList(getSpecialtiesPage, { params: { name } });
  const deletion = useDeleteAction(removeSpecialty, {
    onDone: list.afterRemove,
    failMessage: 'No se pudo eliminar la especialidad.',
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas, servicios y disponibilidad del
            personal especializado.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar especialidad..."
            className="min-w-[220px] flex-1 sm:flex-initial"
          />
          <Button onClick={() => navigate('/admin/specialties/new')}>
            + Nueva Especialidad
          </Button>
        </div>
      </div>

      <ErrorBanner>{list.error}</ErrorBanner>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre de la Especialidad</th>
                <th className="px-6 py-3.5">Descripción</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {list.loading && (
                <TableMessageRow colSpan={4}>
                  Cargando especialidades...
                </TableMessageRow>
              )}
              {!list.loading && list.items.length === 0 && (
                <TableMessageRow colSpan={4}>
                  {name
                    ? 'No hay especialidades que coincidan con la búsqueda.'
                    : 'Todavía no hay especialidades cargadas.'}
                </TableMessageRow>
              )}
              {!list.loading &&
                list.items.map((specialty) => (
                  <tr
                    key={specialty.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-med-primary-900">
                      {specialty.name}
                    </td>
                    <td className="px-6 py-4 text-med-text-sub">
                      {specialty.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        Activa
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteIconButton
                        label={`Eliminar ${specialty.name}`}
                        onClick={() => deletion.request(specialty)}
                      />
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
          title="¿Eliminar esta especialidad?"
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
            dejará de aparecer en el sistema. Solo se puede eliminar si no tiene
            médicos activos.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default SpecialtiesPage;
