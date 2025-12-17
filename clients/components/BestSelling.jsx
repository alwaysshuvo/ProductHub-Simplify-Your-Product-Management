'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {
  const displayQuantity = 8

  const products = useSelector(state =>
    Array.isArray(state.product.list) ? state.product.list : []
  )

  const sortedProducts = products
    .slice()
    .sort((a, b) => {
      const ratingA = a?.rating?.length || 0
      const ratingB = b?.rating?.length || 0
      return ratingB - ratingA
    })

  return (
    <div className='px-6 my-30 max-w-6xl mx-auto'>
      <Title
        title='Best Selling'
        description={`Showing ${Math.min(displayQuantity, products.length)} of ${products.length} products`}
        href='/shop'
      />

      <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
        {sortedProducts.slice(0, displayQuantity).map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default BestSelling
