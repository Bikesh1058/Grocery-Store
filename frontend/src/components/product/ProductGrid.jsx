import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products = [] }) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

export default ProductGrid;
