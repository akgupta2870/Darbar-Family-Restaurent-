import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Sparkles, SlidersHorizontal, Image } from 'lucide-react';
import { MenuItem, FoodCategory, FoodType } from '../../types';
import { FirebaseService } from '../../services/firebaseService';
import { useOrder } from '../../context/OrderContext';

interface AdminMenuProps {
  menuItems: MenuItem[];
  onRefreshMenu: () => void;
}

export const AdminMenu: React.FC<AdminMenuProps> = ({ menuItems, onRefreshMenu }) => {
  const { showToast } = useOrder();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Main Course',
    description: '',
    price: 250,
    type: 'veg',
    image: '',
    isBestseller: false,
    isAvailable: true,
  });

  const categories: FoodCategory[] = [
    'Starters',
    'Main Course',
    'Breads',
    'Rice & Biryani',
    'Chinese',
    'Beverages',
    'Desserts',
  ];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Main Course',
      description: '',
      price: 250,
      type: 'veg',
      image: menuItems[0]?.image || '',
      isBestseller: false,
      isAvailable: true,
    });
    setIsAddingNew(true);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsAddingNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (isAddingNew) {
      await FirebaseService.addMenuItem({
        name: formData.name || 'New Item',
        category: formData.category as FoodCategory,
        description: formData.description || '',
        price: Number(formData.price) || 200,
        type: (formData.type as FoodType) || 'veg',
        image: formData.image || menuItems[0]?.image || '',
        isBestseller: !!formData.isBestseller,
        isAvailable: formData.isAvailable !== false,
      });
      showToast('Item Added', `${formData.name} added to restaurant menu`, 'success');
    } else if (editingItem) {
      await FirebaseService.updateMenuItem(editingItem.id, formData);
      showToast('Item Updated', `${formData.name} updated successfully`, 'success');
    }

    setIsAddingNew(false);
    setEditingItem(null);
    onRefreshMenu();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      await FirebaseService.deleteMenuItem(id);
      showToast('Item Removed', `${name} deleted from menu`, 'info');
      onRefreshMenu();
    }
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    const updated = !item.isAvailable;
    await FirebaseService.updateMenuItem(item.id, { isAvailable: updated });
    showToast(
      updated ? 'Item Enabled' : 'Item Disabled',
      `${item.name} is now ${updated ? 'available' : 'unavailable'} for orders`,
      'info'
    );
    onRefreshMenu();
  };

  const filtered = menuItems.filter((i) => {
    if (selectedCat !== 'All' && i.category !== selectedCat) return false;
    if (search.trim()) {
      return i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Menu Item Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, toggle availability, and set bestsellers across all {menuItems.length} menu items.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-[#141722] text-slate-400 hover:text-white border border-[#242937]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141722] border border-[#262c3b] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-[#141722] border border-[#232837] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202534] bg-[#11131c] text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item & Visual</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Bestseller</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2331]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#181c28] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-[#1c202a] border border-[#2e3444] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-white leading-snug">{item.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {item.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.type === 'veg'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="capitalize">{item.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    ₹{item.price}
                  </td>
                  <td className="py-3 px-4">
                    {item.isBestseller ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ★ Bestseller
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.isAvailable ? '✓ In Stock' : '✕ Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 hover:bg-[#222837] rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="p-1.5 hover:bg-rose-950/40 rounded text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#141722] border border-[#282f40] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#222736]">
              <h3 className="text-base font-serif font-bold text-white">
                {isAddingNew ? 'Add New Food Item' : `Edit "${editingItem?.name}"`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mutton Rogan Josh"
                  className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as FoodCategory })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Food Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FoodType })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none"
                  >
                    <option value="veg">Vegetarian (Green)</option>
                    <option value="non-veg">Non-Vegetarian (Red)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-0"
                    />
                    <span className="text-white">Bestseller Badge</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, preparation and flavor profile..."
                  className="w-full px-3 py-2 rounded-lg bg-[#181c26] border border-[#2a3040] text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[#222736] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#202534] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
