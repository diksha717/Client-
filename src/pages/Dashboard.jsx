import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { userAPI, projectAPI, taskAPI } from '../utils/services.js';
import Alert from '../components/Alert.jsx';
import { Briefcase, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes, projectsRes] = await Promise.all([
        userAPI.getUserStats(),
        taskAPI.getTasks({}),
        projectAPI.getProjects(),
      ]);

      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.slice(0, 5));
      setRecentProjects(projectsRes.data.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      in_progress: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
      completed: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    };
    return colors[status] || 'bg-slate-500/10 text-slate-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page max-w-[1400px]">
      {/* Hero Section */}
      <div className="hero-panel mb-8 p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
          <p className="mt-2 text-blue-100/80 max-w-xl">Track your team progress and focus on top priorities with real-time analytics.</p>
        </div>
        {/* Subtle decorative circle */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Assigned Projects', value: stats?.assignedProjects || 0, icon: Briefcase, color: 'text-sky-400', bg: 'bg-sky-400/10' },
          { label: 'Assigned Tasks', value: stats?.assignedTasks || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((item) => (
          <div key={item.label} className="surface-card p-6 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
              <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon size={22} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-black text-white">{item.value}</p>
              <p className="text-[10px] uppercase font-bold text-slate-500 mt-2 tracking-widest">Updated just now</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="surface-card flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Recent Tasks</h2>
            <Link to="/tasks" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
                  <div className="task-card flex items-center justify-between hover:bg-slate-700/30">
                    <div>
                      <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{task.project.title}</p>
                    </div>
                    <span className={`badge ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-10 text-center text-slate-500 italic">No tasks assigned yet</div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="surface-card flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
            <Link to="/projects" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block group">
                  <div className="task-card flex items-center justify-between hover:bg-slate-700/30 border-l-4 border-l-blue-500">
                    <div>
                      <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{project.title}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                        {project._count.tasks} Tasks • {project.members.length} Members
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {/* Placeholder for avatars */}
                      {[1, 2].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-[#1e293b] bg-slate-600"></div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-10 text-center text-slate-500 italic">No projects yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}