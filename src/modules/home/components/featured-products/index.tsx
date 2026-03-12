import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import CategoryProducts from "@modules/home/components/category-products"

export default async function FeaturedProducts({
  collections,
  categories,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  categories?: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
}) {
  // If we have collections, show them
  if (collections && collections.length > 0) {
    const productRails = await Promise.all(
      collections.map(async (collection) => {
        const rail = await ProductRail({ collection, region })
        return rail ? (
          <li key={collection.id}>
            {rail}
          </li>
        ) : null
      })
    )

    const validRails = productRails.filter(Boolean)

    if (validRails.length === 0) {
      return (
        <li>
          <div className="content-container py-12 small:py-24">
            <Text className="txt-large text-ui-fg-subtle text-center">
              No products found in collections. Please add some products to your collections.
            </Text>
          </div>
        </li>
      )
    }

    return validRails
  }

  // If no collections but we have categories, show products from categories
  if (categories && categories.length > 0) {
    const categoryProducts = await Promise.all(
      categories.slice(0, 2).map(async (category) => {
        const products = await CategoryProducts({ category, region })
        return products ? (
          <li key={category.id}>
            {products}
          </li>
        ) : null
      })
    )

    const validCategoryProducts = categoryProducts.filter(Boolean)

    if (validCategoryProducts.length === 0) {
      return (
        <li>
          <div className="content-container py-12 small:py-24">
            <Text className="txt-large text-ui-fg-subtle text-center">
              No products found in categories. Please add some products to your categories.
            </Text>
          </div>
        </li>
      )
    }

    return validCategoryProducts
  }

  // If neither collections nor categories have products
  return (
    <li>
      <div className="content-container py-12 small:py-24">
        <Text className="txt-large text-ui-fg-subtle text-center">
          No collections or categories found. Please add some collections or categories to your store.
        </Text>
      </div>
    </li>
  )
}
