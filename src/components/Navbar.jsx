import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AddTask from './AddTask';
import { SearchContext } from '../App';

const Navbar = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);  // State to handle modal visibility
     // Get search context
     const { searchQuery, setSearchQuery } = useContext(SearchContext);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

     // Handle search input changes
     const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-4xl font-bold font-cookie whitespace-nowrap dark:text-white">Task Manager</span>
                </Link>
                {/* Search Bar */}
                <div className="items-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <div className="relative md:flex justify-center flex-grow">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search Task"
                            className="w-64 md:w-80 lg:w-96 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                </div>
                {/* Add Task Button */}
                <div className="flex md:order-2 space-x-3">
                    <button type="button" onClick={toggleModal} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Task</button>
                    
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                
                
            </div>
            {/* Modal for "Add Task" */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-30 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-96 p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-semibold text-center dark:text-white">Add Task</h2>
                        <hr className="my-2 border-t-2 border-gray-300 dark:border-gray-600" />
                        
                        {/* Render the AddTask Component inside the modal */}
                        <AddTask onCloseModal={toggleModal}/>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
