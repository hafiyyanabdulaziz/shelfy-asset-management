// Third-party Imports
import { getServerSession } from 'next-auth'

// Component Imports
import CategoriesList from '@views/apps/categories/CategoriesList'

// Lib Imports
import { authOptions } from '@/libs/auth'

const getCategoriesData = async (accessToken) => {
  const res = await fetch(`${process.env.API_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: 'no-store'
  })

  if (!res.ok) {
    throw new Error('Failed to fetch categories data')
  }

  return res.json()
}

const CategoriesApp = async () => {
  const session = await getServerSession(authOptions)
  const data = await getCategoriesData(session?.accessToken)

  return <CategoriesList categoriesData={data} />
}

export default CategoriesApp
