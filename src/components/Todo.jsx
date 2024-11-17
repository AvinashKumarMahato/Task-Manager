import { CheckCircle, MoreVertical, XCircle } from 'lucide-react';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SearchContext } from '../App';

const Todo = () => {
  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [todos, setTodos] = useState([]);
  const dropdownRef = useRef(null);
  const [alertInfo, setAlertInfo] = useState({
    isVisible: false,
    type: '',
    message: ''
  });

  const showAlert = (type, message) => {
    // First hide any existing alert
    setAlertInfo(prev => ({ ...prev, isVisible: false }));
    
    // Then show new alert after a brief delay
    setTimeout(() => {
      setAlertInfo({
        isVisible: true,
        type,
        message
      });

      // Auto hide after 3 seconds
      setTimeout(() => {
        setAlertInfo(prev => ({ ...prev, isVisible: false }));
      }, 2000);
    }, 100);
  };

  const { searchQuery } = useContext(SearchContext);

  const filteredTodos = todos.filter(todo => {
    if (!searchQuery) return !todo.isCompleted;

    const searchTerm = searchQuery.toLowerCase();
    return (
      !todo.isCompleted &&
      (todo.title?.toLowerCase().includes(searchTerm) ||
        todo.description?.toLowerCase().includes(searchTerm))
    );
  });

  const toggleDropdown = (todoId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setOpenDropdowns(prev => {
      const newDropdowns = new Set(prev);
      if (newDropdowns.has(todoId)) {
        newDropdowns.delete(todoId);
      } else {
        newDropdowns.clear(); // Close other dropdowns
        newDropdowns.add(todoId);
      }
      return newDropdowns;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadTodos = () => {
    try {
      const storedTodos = localStorage.getItem('todolist');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      setTodos([]);
    }
  };

  useEffect(() => {
    loadTodos();

    const handleStorageChange = (e) => {
      if (e.key === 'todolist' || e.key === null) {
        loadTodos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('todolistUpdated', loadTodos);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('todolistUpdated', loadTodos);
    };
  }, []);

  const updateLocalStorage = (updatedTodos) => {
    try {
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
      window.dispatchEvent(new Event('todolistUpdated'));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  };

  const deleteTodo = (todoId) => {
    try {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    updateLocalStorage(updatedTodos);
    setOpenDropdowns(new Set());
    showAlert('success', 'Task deleted successfully');
    }catch (error) {
      console.error("Error deleting todo:", error);
      showAlert('error', 'Failed to delete task');
    }
  };

  const togglePin = (todoId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updatedTodos = todos.map(todo =>
        todo.id === todoId
          ? { ...todo, isPinned: !todo.isPinned }
          : todo
      );
  
      // Reorder tasks so pinned tasks appear at the top
      updatedTodos.sort((a, b) => b.isPinned - a.isPinned);
  
      updateLocalStorage(updatedTodos);
      setOpenDropdowns(new Set());
  
      // Show appropriate alert based on pin state
      const pinnedTodo = updatedTodos.find(todo => todo.id === todoId);
      if (pinnedTodo?.isPinned) {
        showAlert('success', 'Task pinned successfully!');
      } else {
        showAlert('success', 'Task unpinned successfully!');
      }
    } catch (error) {
      console.error("Error toggling pin state for todo:", error);
      showAlert('error', 'Failed to toggle pin state for the task');
    }
  };
  
  

  const markComplete = (todoId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {

    const updatedTodos = todos.map(todo =>
      todo.id === todoId
        ? { ...todo, isCompleted: true, completedAt: new Date().toISOString() }
        : todo
    );
    updateLocalStorage(updatedTodos);
    setOpenDropdowns(new Set());
    showAlert('success', 'Mark as completed successfully!');
  }catch (error) {
    console.error("Error marking todo as incomplete:", error);
    showAlert('error', 'Failed to mark task as incomplete');
  }
  };
  const Alert = ({ type, message }) => (
    <div
      className={`flex items-center p-4 mb-6 text-sm rounded-lg ${
        type === 'error'
          ? 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'
          : 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400'
      }`}
      role="alert"
    >
      {type === 'error' ? (
        <XCircle className="w-5 h-5 mr-2" />
      ) : (
        <CheckCircle className="w-5 h-5 mr-2" />
      )}
      <span className="font-medium mr-1">
        {type === 'error' ? 'Error:' : 'Success:'}
      </span>
      {message}
    </div>
  );

  return (
    <section className="pt-[80px] px-6 md:px-12 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Active Tasks</h2>
      {alertInfo.isVisible && (
        <Alert type={alertInfo.type} message={alertInfo.message} />
      )}

      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`p-6 bg-white border rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 relative ${
                todo.isPinned
                  ? 'border-blue-500 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {todo.isPinned && (
                <span className="absolute top-2 left-2 text-blue-500 dark:text-blue-400 text-sm">
                  📌 Pinned
                </span>
              )}

              <div className="relative">
                <button
                  onClick={(e) => toggleDropdown(todo.id, e)}
                  className="absolute top-0 right-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {openDropdowns.has(todo.id) && (
                  <div
                    ref={dropdownRef}
                    className="z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-8 right-0"
                  >
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={(e) => togglePin(todo.id, e)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          {todo.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={(e) => markComplete(todo.id, e)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Mark Complete
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400 dark:hover:text-white"
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {todo.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {todo.description}
                </p>
                {todo.createdAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Created: {new Date(todo.createdAt).toLocaleString()}
                  </p>
                )}
                {todo.modifiedAt && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Modified: {new Date(todo.modifiedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery
            ? 'No tasks found matching your search'
            : 'No active tasks available'}
        </p>
      )}
    </section>
  );
};

export default Todo;
