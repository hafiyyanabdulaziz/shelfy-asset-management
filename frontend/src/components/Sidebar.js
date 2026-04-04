import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
  List, ListItem, ListItemText, ListItemIcon, 
  Divider, Typography, Button, IconButton 
} from '@mui/material';
import { Folder, Category, Add } from '@mui/icons-material';
import FolderModal from './FolderModal';
import CategoryModal from './CategoryModal';

const Sidebar = ({ onSelectFolder, onSelectCategory, selectedFolder, selectedCategory }) => {
  const [folders, setFolders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const folderRes = await api.get('/api/v1/folders');
      const catRes = await api.get('/api/v1/categories');
      setFolders(folderRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to fetch sidebar data', err);
    }
  };

  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <Typography variant="h6" className="font-bold text-indigo-600">Shelfy</Typography>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 flex justify-between items-center">
          <Typography variant="subtitle2" color="textSecondary">FOLDERS</Typography>
          <IconButton size="small" onClick={() => setFolderModalOpen(true)}><Add fontSize="small" /></IconButton>
        </div>
        <List size="small">
          {folders.map(f => (
            <ListItem 
              button 
              key={f.id} 
              selected={selectedFolder === f.id}
              onClick={() => onSelectFolder(f.id)}
            >
              <ListItemIcon><Folder fontSize="small" /></ListItemIcon>
              <ListItemText primary={f.name} />
            </ListItem>
          ))}
        </List>

        <Divider />

        <div className="p-4 flex justify-between items-center">
          <Typography variant="subtitle2" color="textSecondary">CATEGORIES</Typography>
          <IconButton size="small" onClick={() => setCategoryModalOpen(true)}><Add fontSize="small" /></IconButton>
        </div>
        <List size="small">
          {categories.map(c => (
            <ListItem 
              button 
              key={c.id}
              selected={selectedCategory === c.id}
              onClick={() => onSelectCategory(c.id)}
            >
              <ListItemIcon><Category fontSize="small" /></ListItemIcon>
              <ListItemText primary={c.name} />
            </ListItem>
          ))}
        </List>
      </div>

      <FolderModal 
        open={folderModalOpen} 
        handleClose={() => setFolderModalOpen(false)} 
        onUpdate={fetchData} 
        folders={folders}
      />
      <CategoryModal 
        open={categoryModalOpen} 
        handleClose={() => setCategoryModalOpen(false)} 
        onUpdate={fetchData} 
      />
    </div>
  );
};

export default Sidebar;
