'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'

// Component Imports
import FolderCard from './FolderCard'
import ItemCard from './ItemCard'
import ItemModal from './ItemModal'
import AddFolderModal from '../folders/AddFolderModal'

const FileExplorer = ({ browseData, allFolders, categories }) => {
  const { folders, items, breadcrumbs, currentFolderId } = browseData

  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const router = useRouter()
  const params = useParams()
  const locale = params.lang || 'en'

  // --- Navigation ---
  const navigateToFolder = (folderId) => {
    if (folderId) {
      router.push(`/${locale}/apps/items?folderId=${folderId}`)
    } else {
      router.push(`/${locale}/apps/items`)
    }
  }

  // --- Handlers ---
  const handleOpenAddItem = () => {
    setSelectedItem(null)
    setItemModalOpen(true)
  }

  const handleEditItem = (item) => {
    setSelectedItem(item)
    setItemModalOpen(true)
  }

  const handleUpdate = () => {
    router.refresh()
  }

  const handleOpenAddFolder = () => {
    setFolderModalOpen(true)
  }

  const isEmpty = (!folders || folders.length === 0) && (!items || items.length === 0)

  return (
    <Box>
      {/* Header */}
      <div className='flex justify-between items-center mbe-4'>
        <Typography variant='h4' className='font-bold'>
          Items
        </Typography>
        <div className='flex gap-2'>
          <Button
            variant='outlined'
            startIcon={<i className='tabler-folder-plus' />}
            onClick={handleOpenAddFolder}
          >
            New Folder
          </Button>
          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
            onClick={handleOpenAddItem}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs aria-label='breadcrumb' className='mbe-4'>
        <Link
          underline='hover'
          color={breadcrumbs && breadcrumbs.length === 0 ? 'text.primary' : 'inherit'}
          onClick={() => navigateToFolder(null)}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <i className='tabler-home text-lg' />
          Root
        </Link>
        {breadcrumbs && breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return isLast ? (
            <Typography key={crumb.id} color='text.primary' className='font-medium'>
              {crumb.name}
            </Typography>
          ) : (
            <Link
              key={crumb.id}
              underline='hover'
              color='inherit'
              onClick={() => navigateToFolder(crumb.id)}
              sx={{ cursor: 'pointer' }}
            >
              {crumb.name}
            </Link>
          )
        })}
      </Breadcrumbs>

      <Divider className='mbe-4' />

      {/* Content Grid */}
      {isEmpty ? (
        <Box className='text-center p-12 bg-backgroundPaper rounded shadow-sm'>
          <i className='tabler-folder-off text-5xl text-textDisabled mbe-2' />
          <Typography color='text.secondary'>
            This folder is empty. Create a folder or add an item!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Folders first */}
          {folders && folders.map(folder => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`folder-${folder.id}`}>
              <FolderCard
                folder={folder}
                onClick={() => navigateToFolder(folder.id)}
                onUpdate={handleUpdate}
              />
            </Grid>
          ))}

          {/* Then items */}
          {items && items.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`item-${item.id}`}>
              <ItemCard
                item={item}
                onUpdate={handleUpdate}
                onEdit={() => handleEditItem(item)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modals */}
      <ItemModal
        open={itemModalOpen}
        handleClose={() => setItemModalOpen(false)}
        onUpdate={handleUpdate}
        item={selectedItem}
        folders={allFolders}
        categories={categories}
        defaultFolderId={currentFolderId}
      />

      <AddFolderModal
        open={folderModalOpen}
        handleClose={() => setFolderModalOpen(false)}
        onUpdate={handleUpdate}
        folders={allFolders}
        defaultParentId={currentFolderId}
      />
    </Box>
  )
}

export default FileExplorer
