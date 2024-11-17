import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AddTask = ({ onCloseModal }) => {
    const [allTodos, setAllTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Add alert state
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Load existing todos when component mounts
    useEffect(() => {
        const existingTodos = localStorage.getItem('todolist');
        if (existingTodos) {
            setAllTodos(JSON.parse(existingTodos));
        }
    }, []);

    // Function to show alert
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        
        // Hide alert after 3 seconds
        setTimeout(() => {
            setAlert({ show: false, type: '', message: '' });
            
            // If it was a success alert, close modal and navigate
            if (type === 'success') {
                if (onCloseModal) {
                    onCloseModal();
                }
                if (location.pathname !== '/') {
                    navigate('/');
                }
            }
        },1000);
    };

    const handleAddNewToDo = async (e) => {
        e.preventDefault();

        // Form validation
        if (!newTodoTitle.trim() || !newDescription.trim()) {
            showAlert('error', 'Please fill in both title and description');
            return;
        }

        try {
            // Create new todo object with unique ID
            const newToDoObj = {
                id: Math.random().toString(36).substr(2, 9),
                title: newTodoTitle.trim(),
                description: newDescription.trim(),
                isCompleted: false,
                isPinned: false,
                createdAt: new Date().toISOString(),
            };

            // Get existing todos from localStorage
            const existingTodos = JSON.parse(localStorage.getItem('todolist') || '[]');
            
            // Add new todo to the beginning of the array
            const updatedTodoArr = [newToDoObj, ...existingTodos];
            
            // Update localStorage
            localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
            
            // Dispatch event to notify other components
            window.dispatchEvent(new Event('todolistUpdated'));
            
            // Clear form
            setNewDescription('');
            setNewTodoTitle('');
            
            // Show success alert and handle navigation/modal close
            showAlert('success', 'Task added successfully!');
            
        } catch (error) {
            console.error('Error adding task:', error);
            showAlert('error', 'Failed to add task. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto mt-8">
            {/* Alert Messages */}
            {alert.show && alert.type === 'error' && (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">Error!</span> {alert.message}
                </div>
            )}
            
            {alert.show && alert.type === 'success' && (
                <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                    <span className="font-medium">Success!</span> {alert.message}
                </div>
            )}

            <form onSubmit={handleAddNewToDo}>
                <div className="mb-5">
                    <label 
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Title
                    </label>
                    <input 
                        type="text"
                        id="title"
                        value={newTodoTitle}
                        onChange={e => setNewTodoTitle(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Task Title"
                        required
                        maxLength={50}
                    />
                </div>
                <div className="mb-5">
                    <label 
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Task Description"
                        required
                        rows={3}
                        maxLength={200}
                    />
                </div>
                <button 
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Add Task
                </button>
            </form>
        </div>
    );
};

export default AddTask;