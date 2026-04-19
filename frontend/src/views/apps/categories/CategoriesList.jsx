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
import AddCategoryModal from './AddCategoryModal'

const CategoriesList = ({ categoriesData }) => {
  // States
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Hooks
  const router = useRouter()
  const { data: session } = useSession()

  const handleOpenAddModal = () => {
    setSelectedCategory(null)
    setModalOpen(true)
  }

  const handleEdit = category => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`
        }
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (err) {
      console.error('Failed to delete category', err)
    }
  }

  const handleUpdate = () => {
    router.refresh()
  }

  return (
    <Card>
      <CardHeader
        title='Categories'
        action={
          <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={handleOpenAddModal}>
            Add New Category
          </Button>
        }
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoriesData && categoriesData.length > 0 ? (
              categoriesData.map(row => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    <div className='flex items-center gap-2'>
                      <i className='tabler-category text-primary' />
                      <Typography color='text.primary' className='font-medium'>
                        {row.name}
                      </Typography>
                    </div>
                  </TableCell>
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
                <TableCell colSpan={3} align='center'>
                  <Typography className='p-4'>No categories found. Create your first category!</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddCategoryModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
        categoryToEdit={selectedCategory}
      />
    </Card>
  )
}

export default CategoriesList
