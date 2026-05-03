import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Mail, UserCheck } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-page flex items-center justify-center py-10 px-4">
      <div className="surface-card w-full max-w-lg p-8 md:p-12 relative overflow-hidden">
        {/* Profile Header Section */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
            <span className="text-white text-4xl font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{user?.name}</h1>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-2">
            User Account
          </p>
        </div>

        {/* Info Rows */}
        <div className="space-y-4 mb-10">
          {[
            { label: 'Email Address', value: user?.email, icon: Mail, color: 'text-blue-400' },
            { label: 'Access Level', value: user?.role === 'admin' ? 'System Administrator' : 'Team Member', icon: ShieldCheck, color: 'text-purple-400' },
            { label: 'Account Status', value: 'Verified & Active', icon: UserCheck, color: 'text-emerald-400' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className={`p-2 rounded-lg bg-slate-800 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-1">
                  {item.label}
                </p>
                <p className="text-slate-200 font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Logout Action */}
        <div className="pt-6 border-t border-slate-700/50">
          {!showLogout ? (
            <button
              onClick={() => setShowLogout(true)}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={18} />
              Logout from Session
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                <p className="text-amber-400 text-sm font-medium">Are you sure you want to logout?</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogout(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}