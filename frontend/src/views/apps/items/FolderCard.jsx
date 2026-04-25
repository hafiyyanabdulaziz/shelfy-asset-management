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
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useSession } from 'next-auth/react'

const FolderCard = ({ folder, onClick, onUpdate }) => {
  const { data: session } = useSession()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (e) => {
    if (e) e.stopPropagation()
    setAnchorEl(null)
  }

  const handleDeleteConfirm = async (e) => {
    if (e) e.stopPropagation()
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
    if (e) e.stopPropagation()
    setDeleteOpen(true)
    handleMenuClose()
  }

  const closeDeleteDialog = (e) => {
    if (e) e.stopPropagation()
    setDeleteOpen(false)
  }

  return (
    <>
      <Card
        onClick={onClick}
        sx={{
          height: 180,
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 6,
            backgroundColor: 'action.hover',
          }
        }}
      >
        <IconButton
          size='small'
          sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}
          onClick={handleMenuClick}
        >
          <i className='tabler-dots-vertical text-xl' />
        </IconButton>
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 2,
          p: '20px !important'
        }}>
          <i className='tabler-folder-filled text-[80px] text-warning mb-2' />
          <Typography variant='h6' className='font-bold text-center line-clamp-1' sx={{ width: '100%' }}>
            {folder.name}
          </Typography>
        </CardContent>
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            <MenuItem onClick={handleMenuClose}>
              <i className='tabler-edit text-sm me-2' />
              Rename
            </MenuItem>
            <MenuItem onClick={openDeleteDialog} sx={{ color: 'error.main' }}>
              <i className='tabler-trash text-sm me-2' />
              Delete
            </MenuItem>
          </Menu>
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
