import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Categories({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">Shop by Category</Text>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {categories.map((category) => {
          const thumbnail = category.metadata?.thumbnail as string | undefined
          
          return (
            <li key={category.id}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="group block"
              >
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  {!thumbnail && (
                    <div className="text-gray-500 text-2xl">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <Text className="txt-base font-medium group-hover:text-ui-fg-interactive">
                    {category.name}
                  </Text>
                  {category.description && (
                    <Text className="txt-small text-ui-fg-subtle mt-2">
                      {category.description}
                    </Text>
                  )}
                </div>
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
} 