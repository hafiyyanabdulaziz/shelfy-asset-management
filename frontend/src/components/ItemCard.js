import React from 'react';
import { 
  Card, CardContent, CardMedia, Typography, 
  IconButton, Box, Chip 
} from '@mui/material';
import { Edit, Delete, LocationOn, Inventory } from '@mui/icons-material';
import api from '../api/api';

const ItemCard = ({ item, onUpdate, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/v1/items/${item.id}`);
        onUpdate();
      } catch (err) {
        console.error('Failed to delete item', err);
      }
    }
  };

  const mainPhoto = item.photos && item.photos.length > 0 
    ? `${process.env.REACT_APP_API_URL || 'http://localhost:3333'}${item.photos[0].photoUrl}` 
    : 'https://via.placeholder.com/150';

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardMedia
        component="img"
        height="140"
        image={mainPhoto}
        alt={item.name}
        className="h-48 object-cover"
      />
      <CardContent className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="font-bold">{item.name}</Typography>
          <div className="flex gap-1">
            <IconButton size="small" onClick={onEdit}><Edit fontSize="small" /></IconButton>
            <IconButton size="small" color="error" onClick={handleDelete}><Delete fontSize="small" /></IconButton>
          </div>
        </div>
        
        <Typography variant="body2" color="textSecondary" className="mb-4">
          {item.description || 'No description provided.'}
        </Typography>

        <Box className="flex flex-wrap gap-2 mb-4">
          <Chip 
            size="small" 
            icon={<Inventory fontSize="small" />} 
            label={`Qty: ${item.qty || 0}`} 
            variant="outlined" 
          />
          {item.location && (
            <Chip 
              size="small" 
              icon={<LocationOn fontSize="small" />} 
              label={item.location} 
              variant="outlined" 
            />
          )}
        </Box>

        <Typography variant="h6" color="primary" className="font-bold">
          ${item.price || 0}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
