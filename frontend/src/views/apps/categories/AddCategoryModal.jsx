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

// Third-party Imports
import { useSession } from 'next-auth/react'

const AddCategoryModal = ({ open, handleClose, onUpdate, categoryToEdit }) => {
  // States
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // Hooks
  const { data: session } = useSession()

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '')
    } else {
      setName('')
    }
  }, [categoryToEdit, open])

  const handleSubmit = async () => {
    if (!name) return

    setLoading(true)
    try {
      const url = categoryToEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToEdit.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`
      
      const method = categoryToEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ name })
      })

      if (res.ok) {
        onUpdate()
        handleClose()
      }
    } catch (err) {
      console.error('Failed to save category', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-4 mbs-2'>
          <TextField
            fullWidth
            label='Category Name'
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || !name}>
          {categoryToEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCategoryModal
