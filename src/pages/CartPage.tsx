import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Check, ArrowLeft, Tag, ArrowRight, X } from 'lucide-react';
import { useCart, useToast } from '../contexts';
import EmptyState from '../components/ui/EmptyState';
import { Order } from '../contexts/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, orders, updateQuantity, removeFromCart, clearCart, total, placeOrder, saveForLater, savedItems, moveToCart, applyCoupon, discount, itemCount } = useCart();
  const { showToast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCouponApply = () => {
    const result = applyCoupon(couponInput);
    if (result.success) {
      setAppliedCoupon(couponInput.toUpperCase());
    }
    showToast(result.message, result.success ? 'success' : 'error');
    setCouponInput('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Valid phone required';
    if (!formData.address.trim()) newErrors.address = 'Address required';
    if (!formData.city.trim()) newErrors.city = 'City required';
    if (!formData.state.trim()) newErrors.state = 'State required';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const order = placeOrder(formData, appliedCoupon || undefined);
    setOrderPlaced(order);
    if (appliedCoupon) setAppliedCoupon(null);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <Check className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Order Placed Successfully!</h1>
        <p className="text-text-secondary mb-2">Thank you for supporting the CJP movement.</p>
        <p className="text-text-muted text-sm mb-4">Order ID: {orderPlaced.id}</p>
        <p className="text-text-muted text-sm mb-8">Confirmation sent to {formData.email || 'your email'}</p>

        <div className="card mb-6 text-left">
          <h3 className="text-text-primary font-semibold mb-3">Order Summary</h3>
          {orderPlaced.items.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b border-dark-border last:border-0">
              <span className="text-text-secondary">{item.name} × {item.quantity}</span>
              <span className="text-text-primary">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-bold">
            <span className="text-text-primary">Total</span>
            <span className="text-primary">₹{orderPlaced.total}</span>
          </div>
        </div>

        <Link to="/orders" className="btn-primary inline-flex items-center gap-2 mr-4">
          View Orders
        </Link>
        <Link to="/store" className="btn-secondary inline-flex items-center gap-2">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0 && savedItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto">
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-text-muted" />}
          title="Your Cart is Empty"
          description="Support the movement with some CJP merch!"
          action={<Link to="/store" className="btn-primary flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Browse Store</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="card">
              <p className="text-text-muted text-center py-8">Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="card flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                />
                <div className="flex-1">
                  <h3 className="text-text-primary font-semibold">{item.name}</h3>
                  <p className="text-text-muted text-sm">{item.category}</p>
                  <p className="text-primary font-bold mt-1">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => { saveForLater(item.id); showToast('Saved for later', 'info') }}
                    className="text-text-muted hover:text-primary text-sm transition-colors"
                  >
                    Save for later
                  </button>
                  <div className="flex items-center gap-2 bg-dark-hover rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-text-primary font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-text-muted hover:text-secondary transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-text-primary mb-4">Saved for Later</h2>
              {savedItems.map(item => (
                <div key={item.id} className="card flex gap-4 opacity-75">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-text-primary font-medium">{item.name}</h3>
                    <p className="text-primary font-bold">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => { moveToCart(item.id); showToast('Moved to cart', 'success') }}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="card sticky top-20">
            <h2 className="text-lg font-bold text-text-primary mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal ({itemCount} items)</span>
                <span className="text-text-primary">₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Discount</span>
                  <span className="text-green-400">-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-dark-border pt-3 flex justify-between font-bold">
                <span className="text-text-primary">Total</span>
                <span className="text-primary text-xl">₹{(subtotal - discount).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-text-primary text-sm"
              />
              <button onClick={handleCouponApply} className="px-4 py-2 bg-dark-hover text-text-primary rounded-lg text-sm hover:bg-dark-border">
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-green-400">{appliedCoupon} applied!</span>
                <button onClick={() => setAppliedCoupon(null)} className="text-text-muted hover:text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => setShowCheckout(true)}
              disabled={items.length === 0}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <Link to="/store" className="text-text-muted hover:text-text-primary text-sm flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-card border border-dark-border rounded-lg w-full max-w-2xl my-8">
            <div className="flex justify-between p-4 border-b border-dark-border">
              <h2 className="text-xl font-bold text-text-primary">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handleCheckout} className="space-y-4">
                <h3 className="text-lg font-bold text-text-primary mb-2">Delivery Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.name ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.email ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.phone ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="6-digit pincode"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.pincode ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.city ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary ${errors.state ? 'border-red-500' : 'border-dark-border'}`}
                    />
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Address *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House No., Building, Street, Area"
                    className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary resize-none ${errors.address ? 'border-red-500' : 'border-dark-border'}`}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="border-t border-dark-border pt-4 mt-4 space-y-2">
                  <h3 className="text-lg font-bold text-text-primary">Payment (Mock)</h3>
                  <p className="text-text-muted text-sm">This is a demo. No actual payment will be processed.</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 bg-dark-hover rounded-lg cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="accent-primary" />
                      <span className="text-text-primary">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 bg-dark-hover rounded-lg cursor-pointer">
                      <input type="radio" name="payment" className="accent-primary" />
                      <span className="text-text-primary">UPI</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-dark-border pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-text-primary font-bold text-lg">Total</span>
                    <span className="text-primary font-bold text-2xl">₹{(subtotal - discount).toLocaleString()}</span>
                  </div>
                  <button type="submit" className="btn-primary w-full text-lg py-3">
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersPage() {
  const { orders } = useCart();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Order History</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-12 h-12 text-text-muted" />}
          title="No Orders Yet"
          description="Your order history will appear here"
          action={<Link to="/store" className="btn-primary">Browse Store</Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-text-muted text-sm">Order ID</p>
                  <p className="text-text-primary font-mono text-sm">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'shipped' ? 'bg-primary/20 text-primary' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-text-primary">{item.name}</p>
                      <p className="text-text-muted text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-dark-border pt-3 mt-3 flex justify-between">
                <span className="text-text-muted">Total</span>
                <span className="text-primary font-bold">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
