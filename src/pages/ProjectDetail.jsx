import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { projectAPI, taskAPI, userAPI } from '../utils/services.js';
import Alert from '../components/Alert.jsx';
import Modal from '../components/Modal.jsx';
import { Plus, Trash2 } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedToId: '',
  });

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectRes, usersRes] = await Promise.all([
        projectAPI.getProjectById(id),
        userAPI.getUsers(),
      ]);
      setProject(projectRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canManageProject = user?.role === 'admin' || project?.createdById === user?.id;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.createTask({
        ...taskFormData,
        projectId: parseInt(id),
      });
      setSuccess('Task created successfully!');
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedToId: '',
      });
      setIsTaskModalOpen(false);
      fetchProjectData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      await projectAPI.addMember(parseInt(id), parseInt(selectedMember));
      setSuccess('Member added successfully!');
      setSelectedMember('');
      setIsMemberModalOpen(false);
      fetchProjectData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the project?')) {
      try {
        await projectAPI.removeMember(parseInt(id), memberId);
        setSuccess('Member removed successfully!');
        fetchProjectData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to remove member');
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setSuccess('Task deleted successfully!');
        fetchProjectData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert type="error" message="Project not found" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="app-page">
      <div className="hero-panel mb-8">
        <Link to="/projects" className="text-white/90 hover:text-white underline mb-4 inline-block">
          ← Back to Projects
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-2 text-sm md:text-base">{project.description || 'No description available for this project.'}</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {/* Tasks Section */}
          <div className="surface-card mb-8 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
              {canManageProject && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="btn-primary flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              )}
            </div>

            {project.tasks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No tasks in this project yet
              </div>
            ) : (
              <div className="divide-y">
                {project.tasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                  className="m-3 p-4 task-card transition flex items-start justify-between group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-600">Priority: {task.priority}</span>
                      </div>
                    </div>
                    {canManageProject && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteTask(task.id);
                        }}
                        className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="surface-card h-fit overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Members</h2>
            {canManageProject && (
              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          <div className="divide-y">
            {project.members.map((member) => (
              <div key={member.userId} className="p-5 flex items-start justify-between group hover:bg-slate-50 transition">
                <div>
                  <p className="font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-600">{member.user.email}</p>
                </div>
                {canManageProject && member.userId !== project.createdById && (
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
        footer={
          <>
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="btn-primary px-4 py-2"
            >
              Create
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input
            type="text"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
            placeholder="Task title"
            className="input-base"
            required
          />
          <textarea
            value={taskFormData.description}
            onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
            placeholder="Task description"
            className="input-base"
            rows="3"
          />
          <select
            value={taskFormData.priority}
            onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
            className="input-base"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="date"
            value={taskFormData.dueDate}
            onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
            className="input-base"
          />
          <select
            value={taskFormData.assignedToId}
            onChange={(e) => setTaskFormData({ ...taskFormData, assignedToId: e.target.value })}
            className="input-base"
          >
            <option value="">Assign to...</option>
            {project.members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.user.name}
              </option>
            ))}
          </select>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title="Add Team Member"
        footer={
          <>
            <button
              onClick={() => setIsMemberModalOpen(false)}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className="btn-primary px-4 py-2"
            >
              Add
            </button>
          </>
        }
      >
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="input-base"
        >
          <option value="">Select a member...</option>
          {users
            .filter((u) => !project.members.some((m) => m.userId === u.id))
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
        </select>
      </Modal>
    </div>
  );
}
