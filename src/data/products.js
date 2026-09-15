export const PRODUCTS = [
  {
    id: 1,
    name: 'Pink Slip',
    price: 175,
    colors: [
      {
        key: 'pink',
        label: 'Pink',
        swatch: '#f2c9d1',
        images: [
          '/products/pink-slip-1.jpg',
          '/products/pink-slip-2.jpg',
          '/products/pink-slip-3.jpg',
          '/products/pink-slip-4.jpg',
        ],
      },
      {
        key: 'white',
        label: 'White',
        swatch: '#f5f4f0',
        images: ['/products/white-slip-1.jpg', '/products/white-slip-2.jpg'],
      },
    ],
  },
  {
    id: 2,
    name: 'Floral Slip',
    price: 145,
    images: ['/products/floral-slip.jpg'],
  },
  {
    id: 3,
    name: 'Shimmer Slip',
    price: 165,
    images: ['/products/shimmer-slip.jpg'],
  },
  {
    id: 4,
    name: 'Satin Slip',
    price: 155,
    images: ['/products/satin-slip.jpg'],
  },
]

export const SIZES = ['6', '8', '10', '12', '14']

export function getProductImages(product, colorKey) {
  if (!product.colors) return product.images
  const color = product.colors.find((c) => c.key === colorKey) ?? product.colors[0]
  return color.images
}
