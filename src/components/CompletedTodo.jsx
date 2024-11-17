import { MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const CompletedTodo = () => {
  const [openDropdowns, setOpenDropdowns] = useState(new Set());
  const [completedTodos, setCompletedTodos] = useState([]);
  const [alertInfo, setAlertInfo] = useState({
    isVisible: false,
    type: '',
    message: ''
  });
  const dropdownRef = useRef(null);

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

  const toggleDropdown = (todoId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setOpenDropdowns(prev => {
      const newDropdowns = new Set(prev);
      if (newDropdowns.has(todoId)) {
        newDropdowns.delete(todoId);
      } else {
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

  useEffect(() => {
    const loadCompletedTodos = () => {
      try {
        const storedTodos = localStorage.getItem('todolist');
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);
          const completedTodos = parsedTodos
            .filter(todo => todo.isCompleted)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
          setCompletedTodos(completedTodos);
        }
      } catch (error) {
        console.error("Error loading completed todos:", error);
        showAlert('error', 'Failed to load completed tasks');
      }
    };

    loadCompletedTodos();

    const handleStorageChange = () => {
      loadCompletedTodos();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const deleteTodo = (todoId) => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todolist') || '[]');
      const updatedTodos = storedTodos.filter(todo => todo.id !== todoId);
      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
      
      setCompletedTodos(prev => prev.filter(todo => todo.id !== todoId));
      window.dispatchEvent(new Event('storage'));
      showAlert('success', 'Task deleted successfully');
    } catch (error) {
      console.error("Error deleting todo:", error);
      showAlert('error', 'Failed to delete task');
    }
    
    setOpenDropdowns(prev => {
      const newDropdowns = new Set(prev);
      newDropdowns.delete(todoId);
      return newDropdowns;
    });
  };

  const markIncomplete = (todoId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const storedTodos = JSON.parse(localStorage.getItem('todolist') || '[]');
      const updatedTodos = storedTodos.map(todo => {
        if (todo.id === todoId) {
          const { completedAt, ...todoWithoutCompletedAt } = todo;
          return { 
            ...todoWithoutCompletedAt,
            isCompleted: false,
            modifiedAt: new Date().toISOString()
          };
        }
        return todo;
      });

      localStorage.setItem('todolist', JSON.stringify(updatedTodos));
      setCompletedTodos(prev => prev.filter(todo => todo.id !== todoId));
      window.dispatchEvent(new Event('storage'));
      showAlert('success', 'Task marked as incomplete');
    } catch (error) {
      console.error("Error marking todo as incomplete:", error);
      showAlert('error', 'Failed to mark task as incomplete');
    }
    
    setOpenDropdowns(prev => {
      const newDropdowns = new Set(prev);
      newDropdowns.delete(todoId);
      return newDropdowns;
    });
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

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Completed Tasks</h2>
       {alertInfo.isVisible && (
        <Alert type={alertInfo.type} message={alertInfo.message} />
      )}
      
      {Array.isArray(completedTodos) && completedTodos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {completedTodos.map((todo) => (
            <div
              key={todo.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 relative opacity-60"
            >
              <span className="absolute top-2 left-2 text-green-500 dark:text-green-400 text-sm">
                ✓ Done
              </span>
              
              <button
                onClick={(e) => toggleDropdown(todo.id, e)}
                className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                type="button"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {openDropdowns.has(todo.id) && (
                <div
                  ref={dropdownRef}
                  className="z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-10 right-2"
                >
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={(e) => markIncomplete(todo.id, e)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Mark Incomplete
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo.id);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-through">
                {todo.title}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 line-through">
                {todo.description}
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <p>Created: {new Date(todo.createdAt).toLocaleString()}</p>
                {todo.completedAt && (
                  <p>Completed: {new Date(todo.completedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No completed tasks available</p>
      )}
    </section>
  );
};

export default CompletedTodo;