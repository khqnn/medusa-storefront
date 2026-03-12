import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Categories from "@modules/home/components/categories"
import LatestProducts from "@modules/home/components/latest-products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const categories = await listCategories({
    limit: 8,
    fields: "id, handle, name, description, metadata",
  })

  // Debug logging
  console.log("Region:", region?.id, region?.name)
  console.log("Collections count:", collections?.length)
  console.log("Categories count:", categories?.length)

  if (!collections || !region) {
    console.log("Missing collections or region")
    return null
  }

  if (collections.length === 0) {
    console.log("No collections found")
  }

  return (
    <>
      <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts 
            collections={collections} 
            categories={categories}
            region={region} 
          />
        </ul>
      </div>
      {categories && categories.length > 0 && (
        <Categories categories={categories} />
      )}
      <LatestProducts region={region} />
    </>
  )
}
