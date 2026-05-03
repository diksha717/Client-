import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="text-center rounded-2xl border border-slate-200 bg-white/90 px-10 py-12 shadow-xl">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-slate-900 mb-2">404</h1>
        <p className="text-lg text-slate-600 mb-8">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="btn-primary inline-block px-6 py-3"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
