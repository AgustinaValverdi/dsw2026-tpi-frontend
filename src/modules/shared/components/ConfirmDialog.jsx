import Button from './Button';

function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busyLabel,
  busy,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h3 className="text-lg font-bold text-med-primary-900">{title}</h3>
        <div className="text-xs text-med-text-sub mt-2 leading-relaxed">
          {children}
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            variant="danger"
            className="w-full text-xs py-2.5 disabled:opacity-60"
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
          <Button
            variant="outline"
            className="w-full text-xs py-2.5"
            disabled={busy}
            onClick={onCancel}
          >
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
