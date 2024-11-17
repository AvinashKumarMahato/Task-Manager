import React, { createContext, useState } from 'react'
import AddTask from './components/AddTask'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Create a context to share search state across components
export const SearchContext = createContext();

const App = () => {
   // State to store the search query
   const [searchQuery, setSearchQuery] = useState('');


  return (
     // Provide search context to child components
     <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
    <Router >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addTask" element={<AddTask />} />
      </Routes>

    </Router>
    </SearchContext.Provider>
  )
}

export default App
