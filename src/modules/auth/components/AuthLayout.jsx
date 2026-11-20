import { Link } from 'react-router-dom';

function AuthLayout({ title, subtitle, children, footer, footerLink }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-med-primary-950 px-4 py-8 sm:p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <svg
            className="w-8 h-8 text-med-primary-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          MedPortal
        </h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        <div className="p-6 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-med-primary-900">{title}</h2>
            {subtitle && (
              <p className="text-xs text-med-text-sub mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
        {footer}
      </div>

      {footerLink && (
        <div className="mt-6 text-center">
          <Link
            to={footerLink.to}
            className="text-xs text-med-primary-200 hover:text-white transition"
          >
            {footerLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}

export default AuthLayout;
