// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import ItemsList from '@views/apps/items/ItemsList'

// Lib Imports
import { authOptions } from '@/libs/auth'

const getData = async (accessToken, endpoint) => {
  const res = await fetch(`${process.env.API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint} data`)
  }

  return res.json()
}

const ItemsApp = async () => {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  // Fetch all required data in parallel
  const [itemsData, foldersData, categoriesData] = await Promise.all([
    getData(token, 'items'),
    getData(token, 'folders'),
    getData(token, 'categories')
  ])

  return (
    <ItemsList 
      itemsData={itemsData} 
      folders={foldersData} 
      categories={categoriesData} 
    />
  )
}

export default ItemsApp
