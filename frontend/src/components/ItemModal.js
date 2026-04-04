import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, MenuItem 
} from '@mui/material';
import api from '../api/api';

const ItemModal = ({ open, handleClose, item, onUpdate, folders, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    qty: 1,
    location: '',
    folderId: '',
    categoryId: '',
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        qty: item.qty || 1,
        location: item.location || '',
        folderId: item.folderId || '',
        categoryId: item.categoryId || '',
      });
    } else {
      setFormData({
          name: '',
          description: '',
          price: '',
          qty: 1,
          location: '',
          folderId: '',
          categoryId: '',
      });
    }
    setPhotos([]);
  }, [item, open]);

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      photos.forEach(photo => {
        data.append('photos', photo);
      });

      if (item) {
        await api.put(`/api/v1/items/${item.id}`, data);
      } else {
        await api.post('/api/v1/items', data);
      }
      
      onUpdate();
      handleClose();
    } catch (err) {
      console.error('Failed to save item', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              fullWidth label="Name" value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth multiline rows={3} label="Description" value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              fullWidth type="number" label="Price" value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              fullWidth type="number" label="Quantity" value={formData.qty}
              onChange={e => setFormData({...formData, qty: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth label="Location" value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              select fullWidth label="Folder" value={formData.folderId}
              onChange={e => setFormData({...formData, folderId: e.target.value})}
            >
              {folders.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField 
              select fullWidth label="Category" value={formData.categoryId}
              onChange={e => setFormData({...formData, categoryId: e.target.value})}
            >
              {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <input 
              type="file" multiple 
              onChange={e => setPhotos(Array.from(e.target.files))}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemModal;
