import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Grid, Typography, Button, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';

const MainContent = ({ folderId, categoryId, search }) => {
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchMetadata();
  }, [folderId, categoryId, search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = '/api/v1/items?';
      if (folderId) url += `folder_id=${folderId}&`;
      if (categoryId) url += `category_id=${categoryId}&`;
      if (search) url += `search=${search}&`;

      const res = await api.get(url);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const fRes = await api.get('/api/v1/folders');
      const cRes = await api.get('/api/v1/categories');
      setFolders(fRes.data);
      setCategories(cRes.data);
    } catch (err) { }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold">
          {folderId ? 'Folder Items' : categoryId ? 'Category Items' : 'All Items'}
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>Add Item</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {items.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCard item={item} onUpdate={fetchItems} onEdit={() => handleEdit(item)} />
            </Grid>
          ))}
          {items.length === 0 && (
            <div className="w-full text-center p-12 text-gray-500">
              No items found.
            </div>
          )}
        </Grid>
      )}

      <ItemModal 
        open={modalOpen} 
        handleClose={() => setModalOpen(false)} 
        item={editingItem} 
        onUpdate={fetchItems}
        folders={folders}
        categories={categories}
      />
    </div>
  );
};

export default MainContent;
