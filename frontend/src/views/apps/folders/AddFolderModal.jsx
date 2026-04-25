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
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { useSession } from 'next-auth/react'

const AddFolderModal = ({ open, handleClose, onUpdate, folders, folderToEdit, defaultParentId }) => {
  // States
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)

  // Hooks
  const { data: session } = useSession()

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name || '')
      setParentId(folderToEdit.parentId || '')
    } else {
      setName('')
      setParentId(defaultParentId || '')
    }
  }, [folderToEdit, open, defaultParentId])

  const handleSubmit = async () => {
    if (!name) return

    setLoading(true)
    try {
      const url = folderToEdit 
        ? `${process.env.NEXT_PUBLIC_API_URL}/folders/${folderToEdit.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/folders`
      
      const method = folderToEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ name, parentId: parentId || null })
      })

      if (res.ok) {
        onUpdate()
        handleClose()
      }
    } catch (err) {
      console.error('Failed to save folder', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogTitle>{folderToEdit ? 'Edit Folder' : 'Add New Folder'}</DialogTitle>
      <DialogContent>
        <div className='flex flex-col gap-4 mbs-2'>
          <TextField
            fullWidth
            label='Folder Name'
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <TextField
            select
            fullWidth
            label='Parent Folder (Optional)'
            value={parentId}
            onChange={e => setParentId(e.target.value)}
          >
            <MenuItem value=''>Root</MenuItem>
            {folders
              .filter(f => f.id !== folderToEdit?.id) // Prevent self-parenting
              .map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={loading || !name}>
          {folderToEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFolderModal
