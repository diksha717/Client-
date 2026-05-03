import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../utils/services.js';
import Alert from '../components/Alert.jsx';
import { Filter, Trash2, ListChecks } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter((t) => t.id !== taskId));
      } catch (err) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="hero-panel mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-2 text-sm md:text-base">Manage all task statuses, priorities, and assignees in one place.</p>
        </div>
        <ListChecks className="text-white/90 hidden md:block" size={34} />
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filters */}
      <div className="surface-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h3 className="font-bold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-base"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="input-base"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks Cards */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 surface-card">
          <p className="text-gray-600">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/tasks/${task.id}`} className="text-blue-300 hover:text-blue-200 text-lg font-semibold">
                    {task.title}
                  </Link>
                  <p className="text-sm text-slate-300 mt-1">{task.project.title}</p>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-400 hover:text-red-300 inline-flex"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full bg-slate-200/10 text-xs font-semibold uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-200/10 text-xs text-slate-200">
                  {task.assignedTo?.name || 'Unassigned'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
