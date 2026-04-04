import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';

function App() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        onSelectFolder={(id) => { setSelectedFolder(id); setSelectedCategory(null); }}
        onSelectCategory={(id) => { setSelectedCategory(id); setSelectedFolder(null); }}
        selectedFolder={selectedFolder}
        selectedCategory={selectedCategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={setSearchQuery} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <MainContent 
            folderId={selectedFolder} 
            categoryId={selectedCategory} 
            search={searchQuery} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;
