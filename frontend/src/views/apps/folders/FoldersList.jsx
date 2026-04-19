'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useSession } from 'next-auth/react'

// Component Imports
import AddFolderModal from './AddFolderModal'

const FoldersList = ({ foldersData }) => {
  // States
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(null)

  // Hooks
  const router = useRouter()
  const { data: session } = useSession()

  const handleOpenAddModal = () => {
    setSelectedFolder(null)
    setModalOpen(true)
  }

  const handleEdit = folder => {
    setSelectedFolder(folder)
    setModalOpen(true)
  }

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this folder?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete folder', err)
    }
  }

  const handleUpdate = () => {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader
        title='Folders'
        action={
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={handleOpenAddModal}>
            Add New Folder
          </Button>
        }
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foldersData && foldersData.length > 0 ? (
              foldersData.map(row => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    <div className='flex items-center gap-2'>
                      <i className='tabler-folder text-primary' />
                      <Typography color='text.primary' className='font-medium'>
                        {row.name}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' color='secondary' onClick={() => handleEdit(row)}>
                      <i className='tabler-edit text-xl' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDelete(row.id)}>
                      <i className='tabler-trash text-xl' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <Typography className='p-4'>No folders found. Create your first folder!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddFolderModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
        folders={foldersData}
        folderToEdit={selectedFolder}
      />
    </Card>
  )
}

export default FoldersList
