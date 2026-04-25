'use client'

import { useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { useSession } from 'next-auth/react'

const FolderCard = ({ folder, onClick, onUpdate }) => {
  const { data: session } = useSession()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleDeleteConfirm = async (e) => {
    e.stopPropagation()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${folder.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      })

      if (res.ok) {
        setDeleteOpen(false)
        onUpdate()
      }
    } catch (err) {
      console.error('Failed to delete folder', err)
    }
  }

  const openDeleteDialog = (e) => {
    e.stopPropagation()
    setDeleteOpen(true)
  }

  const closeDeleteDialog = (e) => {
    e.stopPropagation()
    setDeleteOpen(false)
  }

  return (
    <>
      <Card
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6,
            backgroundColor: 'action.hover',
          }
        }}
      >
        <CardContent>
          <Box className='flex items-center justify-between'>
            <Box className='flex items-center gap-3'>
              <i className='tabler-folder-filled text-3xl text-warning' />
              <div>
                <Typography variant='subtitle1' className='font-semibold line-clamp-1'>
                  {folder.name}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  Folder
                </Typography>
              </div>
            </Box>
            <IconButton
              size='small'
              color='error'
              onClick={openDeleteDialog}
            >
              <i className='tabler-trash text-lg' />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onClose={closeDeleteDialog} onClick={(e) => e.stopPropagation()}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the folder <b>{folder.name}</b>? All items inside will be deleted too. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color='primary'>
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

export default FolderCard
