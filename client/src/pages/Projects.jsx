import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { projectAPI } from '../utils/services.js';
import Alert from '../components/Alert.jsx';
import Modal from '../components/Modal.jsx';
import { Plus, Trash2, Users, Briefcase, Calendar, FolderKanban } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.createProject(formData);
      setSuccess('Project created successfully!');
      setFormData({ title: '', description: '', deadline: '' });
      setIsModalOpen(false);
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(projectId);
        setSuccess('Project deleted successfully!');
        fetchProjects();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse">Synchronizing projects...</p>
      </div>
    );
  }

  return (
    <div className="app-page max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Projects <span className="text-blue-500">.</span>
          </h1>
          <p className="text-slate-400 text-lg">Manage and monitor your workspace initiatives.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 group"
          >
            <Plus size={22} className="group-hover:rotate-90 transition-transform" />
            New Project
          </button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="surface-card py-24 text-center border-2 border-dashed border-slate-800">
          <FolderKanban className="mx-auto text-slate-700 mb-6" size={64} />
          <h2 className="text-2xl font-bold text-slate-300 mb-2">No projects found</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your workspace is empty. Start by creating a new project to track your team's progress.</p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus size={18} /> Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="surface-card p-8 group relative flex flex-col justify-between border border-white/5 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <Calendar size={14} />
                      <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</span>
                    </div>
                  </div>
                  {user?.role === 'admin' && project.createdById === user.id && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProject(project.id);
                      }}
                      className="p-2 rounded-xl bg-slate-800/50 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <p className="text-slate-400 leading-relaxed mb-8 line-clamp-2">
                  {project.description || 'No description provided for this project.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Users size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{project.members.length} <span className="text-slate-500 font-medium">Members</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-200">{project._count?.tasks || 0} <span className="text-slate-500 font-medium">Tasks</span></span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        footer={
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
            >
              Create Project
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateProject} className="space-y-6 py-2">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Website Redesign"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What is this project about?"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Target Deadline</label>
            <div className="relative">
               <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
} 