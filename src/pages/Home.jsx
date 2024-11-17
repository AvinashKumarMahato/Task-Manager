import React, { useState } from 'react';
import Todo from '../components/Todo';
import CompletedTodo from '../components/CompletedTodo';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Todo'); // Default state

  // Array of tab options
  const tabs = ['Todo', 'Completed'];

  return (
    <div className="bg-gray-100 min-h-screen py-10 mt-16"> {/* Added margin-top to avoid collapse */}
      <div className="container mx-auto px-4">
        {/* Select dropdown for small screens */}
        <div className="sm:hidden mb-4">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {tabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        </div>

        {/* Horizontal tabs for larger screens */}
        <ul className="hidden sm:flex text-sm font-medium text-center text-gray-500 rounded-lg shadow dark:divide-gray-700 dark:text-gray-400">
          {tabs.map((tab) => (
            <li key={tab} className="w-full focus-within:z-10">
              <button
                onClick={() => setActiveTab(tab)}
                className={`inline-block w-full p-4 ${
                  activeTab === tab
                    ? 'text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white'
                    : 'bg-white dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-50'
                } border-r border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-blue-300 focus:outline-none`}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        {/* Conditional rendering of components based on active tab */}
        <div className="mt-6">
          {activeTab === 'Todo' && <Todo />} {/* Render Todo component */}
          {activeTab === 'Completed' && <CompletedTodo />} {/* Render CompletedTodo component */}
        </div>
      </div>
    </div>
  );
};

export default Home;
