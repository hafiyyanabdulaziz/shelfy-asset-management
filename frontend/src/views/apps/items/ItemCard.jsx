'use client'

import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

// Third-party Imports
import { useSession } from 'next-auth/react'

const ItemCard = ({ item, onUpdate, onEdit }) => {
  const { data: session } = useSession()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${item.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      })

      if (res.ok) {
        setDeleteOpen(false)
        onUpdate()
      } else {
        console.error('Delete failed:', await res.text())
      }
    } catch (err) {
      console.error('Failed to delete item', err)
    }
  }

  const mainPhoto = item.photos && item.photos.length > 0 
    ? item.photos[0].signedUrl
    : 'https://placehold.co/600x400?text=No+Image'

  return (
    <>
      <Card className='h-full flex flex-col hover:shadow-lg transition-shadow'>
        <CardMedia
          component='img'
          height='200'
          image={mainPhoto}
          alt={item.name}
          className='h-48 object-cover'
        />
        <CardContent className='flex-1 flex flex-col gap-4'>
          <div className='flex justify-between items-start'>
            <Typography variant='h6' className='font-bold line-clamp-1'>
              {item.name}
            </Typography>
            <div className='flex gap-1'>
              <IconButton size='small' onClick={onEdit}>
                <i className='tabler-edit text-xl' />
              </IconButton>
              <IconButton size='small' color='error' onClick={() => setDeleteOpen(true)}>
                <i className='tabler-trash text-xl' />
              </IconButton>
            </div>
          </div>
          
          <Typography variant='body2' color='text.secondary' className='line-clamp-2 min-bs-[40px]'>
            {item.description || 'No description provided.'}
          </Typography>

          <Box className='flex flex-wrap gap-2'>
            <Chip 
              size='small' 
              icon={<i className='tabler-box text-sm' />} 
              label={`Qty: ${item.qty || 0}`} 
              variant='outlined' 
            />
            {item.location && (
              <Chip 
                size='small' 
                icon={<i className='tabler-map-pin text-sm' />} 
                label={item.location} 
                variant='outlined' 
              />
            )}
          </Box>

          <div className='mt-auto pt-2'>
            <Typography variant='h5' color='primary' className='font-bold'>
              ${item.price ? Number(item.price).toLocaleString() : 0}
            </Typography>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>{item.name}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ItemCard
