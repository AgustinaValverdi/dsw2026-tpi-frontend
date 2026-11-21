function ErrorBanner({ children }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
    >
      {children}
    </div>
  );
}

export default ErrorBanner;
