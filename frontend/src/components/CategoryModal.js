import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField 
} from '@mui/material';
import api from '../api/api';

const CategoryModal = ({ open, handleClose, onUpdate }) => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/api/v1/categories', { name });
      onUpdate();
      handleClose();
      setName('');
    } catch (err) {
      console.error('Failed to create category', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New Category</DialogTitle>
      <DialogContent>
        <div className="mt-4">
          <TextField 
            fullWidth label="Category Name" value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
