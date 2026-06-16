import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Minus, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useCart, useToast } from '../contexts';
import { Product } from '../contexts/CartContext';

const products: Product[] = [
  {
    id: 'prod-1',
    name: 'CJP Black Hoodie',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1556821870-9f3af4c0a5e1?w=600&h=600&fit=crop',
    category: 'Hoodies',
    description: 'Premium quality black hoodie with CJP embroidered logo. Made from 100% cotton for comfort and durability. Perfect for protests and everyday wear.',
    stock: 50,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 'prod-2',
    name: 'Cockroach Rebel T-Shirt',
    price: 699,
    image: 'https://images.unsplash.com/photo-1521572163474-80e73802ccf2?w=600&h=600&fit=crop',
    category: 'T-Shirts',
    description: 'Bold statement tee with the iconic cockroach logo. Available in multiple sizes. Premium cotton blend for lasting comfort.',
    stock: 100,
    rating: 4.5,
    reviews: 89,
  },
  {
    id: 'prod-3',
    name: 'Voice of Youth T-Shirt',
    price: 749,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
    category: 'T-Shirts',
    description: 'Premium cotton tee with Youth Voice graphic. Soft fabric suitable for all-day wear during community events.',
    stock: 75,
    rating: 4.6,
    reviews: 67,
  },
  {
    id: 'prod-4',
    name: 'CJP Sticker Pack',
    price: 199,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25485c3b0?w=600&h=600&fit=crop',
    category: 'Stickers',
    description: 'Set of 10 premium vinyl stickers with CJP logos and slogans. Waterproof and weather-resistant.',
    stock: 200,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 'prod-5',
    name: 'Resistance Poster',
    price: 299,
    image: 'https://images.unsplash.com/photo-1561214115-f2f5f6e1c2be?w=600&h=600&fit=crop',
    category: 'Posters',
    description: 'A3 size premium print for your wall. High-quality print with inspiring CJP movement imagery.',
    stock: 150,
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 'prod-6',
    name: 'Certified Cockroach Badge',
    price: 149,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c3c8a2a3?w=600&h=600&fit=crop',
    category: 'Badges',
    description: 'Metal pin badge with enamel finish. Perfect for jackets, bags, and caps. Show your support!',
    stock: 300,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 'prod-7',
    name: 'CJP Mug',
    price: 399,
    image: 'https://images.unsplash.com/photo-1514228742587-6b155847cca3?w=600&h=600&fit=crop',
    category: 'Accessories',
    description: 'Ceramic mug with CJP branding. Start your day with the movement. Microwave and dishwasher safe.',
    stock: 80,
    rating: 4.6,
    reviews: 72,
  },
  {
    id: 'prod-8',
    name: 'Manifesto Cap',
    price: 599,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop',
    category: 'Accessories',
    description: 'Adjustable cap with embroidered Youth Manifesto text. One size fits all. Comfortable cotton construction.',
    stock: 60,
    rating: 4.4,
    reviews: 38,
  },
];

const categories = ['All', 'Hoodies', 'T-Shirts', 'Stickers', 'Posters', 'Badges', 'Accessories'];

export default function StorePage() {
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  const filteredProducts = useMemo(() => {
    let result = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
    switch (sortBy) {
      case 'price-low':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.price - a.price);
        break;
      default:
        result = result.sort((a, b) => b.reviews - a.reviews);
    }
    return result;
  }, [selectedCategory, sortBy]);

  const getProductQuantity = (productId: string) => {
    const item = items.find(i => i.id === productId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">CJP Merch Store</h1>
        <p className="text-text-secondary">Wear the movement. Support the cause.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat ? 'bg-primary text-dark-bg' : 'bg-dark-card border border-dark-border text-text-secondary hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-text-secondary"
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="card group">
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-dark-bg/80 backdrop-blur rounded-lg">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-text-primary text-sm font-medium">{product.rating}</span>
              </div>
              {product.stock < 20 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-secondary text-white rounded text-xs font-medium">
                  Low Stock
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-dark-hover text-text-muted rounded text-xs">{product.category}</span>
              <span className="text-text-muted text-xs">{product.reviews} reviews</span>
            </div>

            <h3 className="text-text-primary font-semibold mb-1 cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${product.id}`)}>
              {product.name}
            </h3>
            <p className="text-text-muted text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">₹{product.price}</span>
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add
                {getProductQuantity(product.id) > 0 && (
                  <span className="bg-dark-bg text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {getProductQuantity(product.id)}
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Product Not Found</h1>
        <button onClick={() => navigate('/store')} className="btn-primary">Back to Store</button>
      </div>
    );
  }

  const cartQuantity = items.find(i => i.id === product.id)?.quantity || 0;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast(`${quantity} × ${product.name} added to cart!`, 'success');
    setQuantity(1);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6">
        <ArrowLeft className="w-5 h-5" />
        Back to Store
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-dark-hover text-text-muted rounded text-sm">{product.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-text-primary font-bold">{product.rating}</span>
            </div>
            <span className="text-text-muted">({product.reviews} reviews)</span>
            {product.stock < 20 && (
              <span className="text-secondary text-sm">Only {product.stock} left!</span>
            )}
          </div>

          <p className="text-text-secondary mb-6">{product.description}</p>

          <div className="text-4xl font-bold text-primary mb-6">₹{product.price}</div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-dark-hover rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-text-muted hover:text-text-primary"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center text-text-primary font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-text-muted hover:text-text-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
              {cartQuantity > 0 && `(${cartQuantity} in cart)`}
            </button>
          </div>

          <div className="flex items-center gap-4 text-text-muted">
            <button className="flex items-center gap-2 hover:text-primary">
              <Heart className="w-5 h-5" />
              Save
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Link copied!', 'success');
            }} className="flex items-center gap-2 hover:text-primary">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { products };
