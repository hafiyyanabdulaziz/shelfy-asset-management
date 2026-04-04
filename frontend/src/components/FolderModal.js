import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem 
} from '@mui/material';
import api from '../api/api';

const FolderModal = ({ open, handleClose, onUpdate, folders }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/api/v1/folders', { name, parentId: parentId || null });
      onUpdate();
      handleClose();
      setName('');
      setParentId('');
    } catch (err) {
      console.error('Failed to create folder', err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New Folder</DialogTitle>
      <DialogContent>
        <div className="mt-4 flex flex-col gap-4">
          <TextField 
            fullWidth label="Folder Name" value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <TextField 
            select fullWidth label="Parent Folder (Optional)" value={parentId}
            onChange={e => setParentId(e.target.value)}
          >
            <MenuItem value="">Root</MenuItem>
            {folders.map(f => (
              <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
            ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderModal;
