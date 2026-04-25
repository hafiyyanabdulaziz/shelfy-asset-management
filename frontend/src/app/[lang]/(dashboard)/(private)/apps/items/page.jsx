// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import FileExplorer from '@views/apps/items/FileExplorer'

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

const ItemsApp = async ({ searchParams }) => {
  const session = await getServerSession(authOptions)
  const token = session?.accessToken

  const resolvedSearchParams = await searchParams
  const folderId = resolvedSearchParams?.folderId || ''
  const browseUrl = folderId
    ? `folders/browse?parentId=${folderId}`
    : 'folders/browse'

  const [browseData, allFolders, categoriesData] = await Promise.all([
    getData(token, browseUrl),
    getData(token, 'folders'),
    getData(token, 'categories')
  ])

  return (
    <FileExplorer
      browseData={browseData}
      allFolders={allFolders}
      categories={categoriesData}
    />
  )
}

export default ItemsApp
