// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import FoldersList from '@views/apps/folders/FoldersList'

// Lib Imports
import { authOptions } from '@/libs/auth'

const getFoldersData = async (accessToken) => {
  const res = await fetch(`${process.env.API_URL}/folders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch folders data')
  }

  return res.json()
}

const FoldersApp = async () => {
  const session = await getServerSession(authOptions)
  const data = await getFoldersData(session?.accessToken)

  return <FoldersList foldersData={data} />
}

export default FoldersApp
