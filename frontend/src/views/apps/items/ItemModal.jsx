'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useSession } from 'next-auth/react'

const ItemModal = ({ open, handleClose, item, onUpdate, folders, categories, defaultFolderId }) => {
  // States
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    qty: 1,
    location: '',
    folderId: '',
    categoryId: ''
  })
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)

  // Hooks
  const { data: session } = useSession()

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        qty: item.qty || 1,
        location: item.location || '',
        folderId: item.folderId || '',
        categoryId: item.categoryId || ''
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        qty: 1,
        location: '',
        folderId: defaultFolderId || '',
        categoryId: ''
      })
    }
    setPhotos([])
  }, [item, open, defaultFolderId])

  const handleSubmit = async () => {
    if (!formData.name) return

    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key])
        }
      })
      
      photos.forEach(photo => {
        data.append('photos', photo)
      })

      const url = item 
        ? `${process.env.NEXT_PUBLIC_API_URL}/items/${item.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/items`
      
      const method = item ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: data
      })

      if (res.ok) {
        onUpdate()
        handleClose()
      }
    } catch (err) {
      console.error('Failed to save item', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4} className='mbs-0'>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Name'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Description'
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='number'
              label='Price'
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type='number'
              label='Quantity'
              value={formData.qty}
              onChange={e => setFormData({ ...formData, qty: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Location'
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Folder'
              value={formData.folderId}
              onChange={e => setFormData({ ...formData, folderId: e.target.value })}
            >
              <MenuItem value=''>None</MenuItem>
              {folders.map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label='Category'
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            >
              <MenuItem value=''>None</MenuItem>
              {categories.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' className='mbe-2'>
              Photos
            </Typography>
            <input type='file' multiple onChange={e => setPhotos(Array.from(e.target.files))} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || !formData.name}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ItemModal
