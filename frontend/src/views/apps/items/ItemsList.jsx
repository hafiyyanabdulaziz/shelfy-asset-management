'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Component Imports
import ItemCard from './ItemCard'
import ItemModal from './ItemModal'

const ItemsList = ({ itemsData, folders, categories }) => {
  // States
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Hooks
  const router = useRouter()

  const handleOpenAddModal = () => {
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleEdit = item => {
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleUpdate = () => {
    router.refresh()
  }

  return (
    <Box>
      <div className='flex justify-between items-center mbe-6'>
        <Typography variant='h4' className='font-bold'>
          Items
        </Typography>
        <Button 
          variant='contained' 
          startIcon={<i className='tabler-plus' />} 
          onClick={handleOpenAddModal}
        >
          Add New Item
        </Button>
      </div>

      <Grid container spacing={6}>
        {itemsData && itemsData.length > 0 ? (
          itemsData.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCard 
                item={item} 
                onUpdate={handleUpdate} 
                onEdit={() => handleEdit(item)} 
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box className='text-center p-12 bg-backgroundPaper rounded shadow-sm'>
              <Typography color='text.secondary'>
                No items found. Create your first item!
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <ItemModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        onUpdate={handleUpdate}
        item={selectedItem}
        folders={folders}
        categories={categories}
      />
    </Box>
  )
}

export default ItemsList
