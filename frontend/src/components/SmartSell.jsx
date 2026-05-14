import { useState } from 'react';
import { Package, IndianRupee, ShoppingCart, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SmartSell = ({ mode = 'sell' }) => {
  const isBuy = mode === 'buy';
  const navigate = useNavigate();
  const [selectedQty, setSelectedQty] = useState(20);
  const [customQty, setCustomQty] = useState('');

  const availableProducts = [
    { name: 'Tomatoes', icon: '🍅', stock: 50 },
    { name: 'Potatoes', icon: '🥔', stock: 100 },
    { name: 'Onions', icon: '🧅', stock: 80 },
  ];
  
  const [product, setProduct] = useState(availableProducts[0]);
  const [basePrice, setBasePrice] = useState(20);

  // Pricing rules
  const calculatePrice = (qty) => {
    if (qty >= 20) return Math.round(basePrice * 0.8);
    if (qty >= 10) return Math.round(basePrice * 0.85);
    if (qty >= 5) return Math.round(basePrice * 0.9);
    return basePrice;
  };

  const quantities = [1, 5, 10, 20];
  const currentPricePerKg = calculatePrice(selectedQty);
  const totalPrice = selectedQty * currentPricePerKg;

  const handleTransaction = () => {
    if (isBuy) {
      navigate('/checkout', { 
        state: { 
          product: { 
            ...product, 
            price: currentPricePerKg, 
            quantity: selectedQty, 
            farmer: 'Ramesh Kumar', 
            location: 'Nashik, MH' 
          } 
        } 
      });
    } else {
      alert(`Successfully listed ${selectedQty} kg of ${product.name} for sale at ₹${currentPricePerKg}/kg!`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-primary w-5 h-5" /> {isBuy ? 'Smart Buy' : 'Smart Sell'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{isBuy ? 'Buy in bulk and save more' : 'Sell full stock faster'}</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <TrendingUp className="w-3 h-3" /> High Demand
          </span>
          <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3" /> Fast Selling
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Product Info & Quantity Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
              {product.icon}
            </div>
            <div className="flex-1">
              {!isBuy ? (
                <select 
                  value={product.name} 
                  onChange={(e) => setProduct(availableProducts.find(p => p.name === e.target.value))}
                  className="font-bold text-slate-800 text-lg bg-transparent border-b-2 border-slate-300 focus:border-primary outline-none cursor-pointer pb-0.5"
                >
                  {availableProducts.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              ) : (
                <h3 className="font-bold text-slate-800 text-lg">{product.name}</h3>
              )}
              <p className="text-sm text-slate-500 flex items-center gap-1 font-medium mt-1">
                <Package className="w-4 h-4" /> Total Stock: <span className="text-slate-800 font-bold">{product.stock} kg</span>
              </p>
            </div>
            {!isBuy && (
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400">Base Price (₹/kg)</span>
                <input 
                  type="number" 
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-16 text-right font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary mt-1"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Select Quantity to {isBuy ? 'Buy' : 'Sell'}</label>
            <div className="flex flex-wrap gap-3 items-center">
              {quantities.map(qty => (
                <button
                  key={qty}
                  onClick={() => { setSelectedQty(qty); setCustomQty(''); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selectedQty === qty && customQty === ''
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:bg-slate-50'
                  }`}
                >
                  {qty} kg
                </button>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 ml-1">Custom:</span>
                <input 
                  type="number" 
                  min="1"
                  value={customQty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setCustomQty(e.target.value);
                    if (!isNaN(val) && val > 0) {
                      setSelectedQty(val);
                    }
                  }}
                  placeholder="kg"
                  className="w-24 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-primary text-sm font-bold text-slate-700 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-medium text-sm">{isBuy ? 'Estimated Cost' : 'Estimated Revenue'}</span>
            <span className="text-xl font-extrabold text-slate-900 flex items-center">
              <IndianRupee className="w-5 h-5 text-slate-500" /> {totalPrice}
            </span>
          </div>

          {/* Party Details */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <img 
              src={isBuy ? "https://ui-avatars.com/api/?name=Ramesh+Kumar&background=10b981&color=fff" : "https://ui-avatars.com/api/?name=Amit+Sharma&background=3b82f6&color=fff"} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-slate-100 object-cover" 
            />
            <div className="flex-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isBuy ? 'Farmer / Seller' : 'Potential Buyer'}</p>
              <h4 className="font-bold text-slate-800 text-base leading-tight">{isBuy ? 'Ramesh Kumar' : 'Amit Sharma'}</h4>
              <p className="text-xs text-slate-500 font-medium">
                {isBuy ? 'Nashik, MH • ⭐ 4.8' : 'Mumbai, MH • 📍 15 km away'}
              </p>
            </div>
            <button 
              onClick={() => alert(`Viewing profile for ${isBuy ? 'Ramesh Kumar' : 'Amit Sharma'}`)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              View
            </button>
          </div>
        </div>

        {/* Right Side: Dynamic Pricing Rules */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
          <h4 className="text-sm font-bold text-slate-700 mb-2">Dynamic Pricing</h4>
          
          <div className="space-y-3">
            {[
              { qty: 1, price: calculatePrice(1) },
              { qty: 5, price: calculatePrice(5) },
              { qty: 20, price: calculatePrice(20), highlight: true }
            ].map((rule) => (
              <div 
                key={rule.qty} 
                className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${
                  selectedQty === rule.qty 
                    ? 'bg-white border-primary shadow-sm' 
                    : 'border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{rule.qty} kg</span>
                  {rule.highlight && (
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-1 border border-yellow-200">
                      <Sparkles className="w-3 h-3" /> Best Value
                    </span>
                  )}
                </div>
                <div className="font-bold text-slate-800 flex items-center">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> {rule.price} <span className="text-xs text-slate-500 ml-1 font-medium">/kg</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
            <button 
              onClick={() => alert(`Applying ${isBuy ? 'Best Offer' : 'Auto Price'}`)}
              className="flex items-center justify-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 py-3 rounded-xl font-bold transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> {isBuy ? 'Best Offer' : 'Auto Price'}
            </button>
            <button 
              onClick={handleTransaction}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20"
            >
              <ShoppingCart className="w-4 h-4" /> {isBuy ? 'Buy Selected' : 'Sell Selected'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSell;
