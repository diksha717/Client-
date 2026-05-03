import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { taskAPI } from '../utils/services.js';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';
import { ArrowLeft, MessageSquare, Edit2, Trash2 } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTaskData();
  }, [id]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTaskById(id);
      setTask(response.data);
      setEditData({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
      });
    } catch (err) {
      setError('Failed to load task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.updateTask(parseInt(id), editData);
      setSuccess('Task updated successfully!');
      setIsEditing(false);
      fetchTaskData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskAPI.deleteTask(parseInt(id));
        setSuccess('Task deleted!');
        setTimeout(() => window.history.back(), 2000);
      } catch (err) {
        setError(err.message || 'Failed to delete task');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await taskAPI.addComment(parseInt(id), comment);
      setComment('');
      setSuccess('Comment added!');
      fetchTaskData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Alert type="error" message="Task not found" />
      </div>
    );
  }

  const canEdit = user?.role === 'admin' || task.project.createdById === user?.id || task.assignedToId === user?.id;

  return (
    <div className="app-page max-w-3xl">
      <Link to={`/projects/${task.project.id}`} className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        Back to Project
      </Link>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="surface-card overflow-hidden bg-gradient-to-b from-white to-slate-50">
        {/* Header */}
        <div className="p-6 border-b">
          {isEditing ? (
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="input-base text-2xl font-bold"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="input-base"
                rows="4"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="input-base"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                  className="input-base"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary px-4 py-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{task.title}</h1>
                  <p className="text-gray-600 mt-2">{task.description}</p>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <div className="rounded-xl bg-slate-100 px-4 py-3 min-w-[140px]">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium capitalize">{task.status.replace('_', ' ')}</p>
                </div>
                <div className="rounded-xl bg-slate-100 px-4 py-3 min-w-[140px]">
                  <p className="text-sm text-gray-600">Priority</p>
                  <p className="font-medium capitalize">{task.priority}</p>
                </div>
                {task.assignedTo && (
                  <div className="rounded-xl bg-slate-100 px-4 py-3 min-w-[140px]">
                    <p className="text-sm text-gray-600">Assigned to</p>
                    <p className="font-medium">{task.assignedTo.name}</p>
                  </div>
                )}
                {task.dueDate && (
                  <div className="rounded-xl bg-slate-100 px-4 py-3 min-w-[140px]">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare size={20} />
            Comments ({task.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="input-base"
              rows="3"
            />
            <button
              type="submit"
              className="btn-primary mt-2 px-4 py-2"
            >
              Add Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{comment.user.name}</p>
                      <p className="text-sm text-gray-600">{comment.user.email}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-4">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
