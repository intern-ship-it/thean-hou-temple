// src/pages/hallBooking/BillingItems.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingItems,
  createBillingItem,
  updateBillingItem,
  deleteBillingItem,
  setCategory,
} from "../../features/hallBooking/billingItemsSlice";
import {
  Plus,
  RefreshCw,
  Package,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  X,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

const BillingItems = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters } = useSelector(
    (state) => state.billingItems
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Category options
  const categories = [
    { value: "", label: "All Categories" },
    { value: "hall", label: "Hall Rental" },
    { value: "equipment", label: "Equipment" },
    { value: "furniture", label: "Furniture" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  // Statistics
  const statistics = {
    total: items.length,
    active: items.filter((i) => i.is_active).length,
    inactive: items.filter((i) => !i.is_active).length,
    hall: items.filter((i) => i.category === "hall").length,
    equipment: items.filter((i) => i.category === "equipment").length,
  };

  useEffect(() => {
    dispatch(fetchBillingItems({ category: filters.category }));
  }, [dispatch, filters.category]);

  const handleRefresh = () => {
    dispatch(fetchBillingItems({ category: filters.category }));
  };

  const handleCategoryChange = (category) => {
    dispatch(setCategory(category));
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleView = (item) => {
    setViewItem(item);
    setShowViewModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteBillingItem(itemToDelete.id)).unwrap();
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      } catch (err) {
        console.error("Failed to delete item:", err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedItem) {
        await dispatch(
          updateBillingItem({ id: selectedItem.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createBillingItem(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Failed to save item:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter items by search
  const filteredItems = items.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.item_name.toLowerCase().includes(searchLower) ||
      item.item_code.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 font-inter">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjQTYwMDAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] -z-10"></div>

      {/* Header with Gold-Red Gradient */}
      <div className="relative bg-gradient-to-br from-[#A60000] via-[#800000] to-[#FFB200] rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD54F] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB200] opacity-10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FFD54F] to-[#FFB200] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Billing Items
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Manage hall booking billing items and pricing
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FFB200] text-[#800000] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FFD54F]/50 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="tracking-wide">Add Item</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
          <StatCard
            title="Total Items"
            value={statistics.total}
            icon={Package}
          />
          <StatCard
            title="Active"
            value={statistics.active}
            icon={CheckCircle}
          />
          <StatCard
            title="Inactive"
            value={statistics.inactive}
            icon={XCircle}
          />
          <StatCard title="Hall Items" value={statistics.hall} icon={Tag} />
          <StatCard
            title="Equipment"
            value={statistics.equipment}
            icon={Package}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-5 border border-[#FFD54F]/20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-[#FFF8F6] font-medium"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-[#A60000]" strokeWidth={2.5} />
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2.5 text-[#A60000] hover:bg-[#FFD54F]/20 rounded-xl transition-all disabled:opacity-50 border border-[#FFD54F]/30"
            title="Refresh"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
          <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#FFD54F]/20">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-[#A60000] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No billing items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#FFF8F6] to-[#FFD54F]/10 border-b-2 border-[#FFD54F]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#800000] uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#800000] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#800000] uppercase tracking-wider">
                    Internal Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#800000] uppercase tracking-wider">
                    External Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#800000] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#800000] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#FFD54F]/20">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FFF8F6] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900">
                          {item.item_name}
                        </div>
                        <div className="text-sm text-[#A60000] font-semibold">
                          {item.item_code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#FFD54F]/20 text-[#800000] border border-[#FFD54F]/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 font-bold">
                        <DollarSign className="w-4 h-4 mr-1 text-[#A60000]" />
                        RM {parseFloat(item.internal_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 font-bold">
                        <DollarSign className="w-4 h-4 mr-1 text-[#A60000]" />
                        RM {parseFloat(item.external_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="flex items-center text-green-600 text-sm font-bold">
                          <CheckCircle
                            className="w-4 h-4 mr-1"
                            strokeWidth={2.5}
                          />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm font-bold">
                          <XCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2 text-gray-600 hover:text-[#A60000] hover:bg-[#FFD54F]/20 rounded-xl transition-all border border-transparent hover:border-[#FFD54F]/30"
                          title="View"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <BillingItemForm
          item={selectedItem}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          loading={formLoading}
        />
      )}

      {showViewModal && viewItem && (
        <ViewModal item={viewItem} onClose={() => setShowViewModal(false)} />
      )}

      {showDeleteConfirm && itemToDelete && (
        <DeleteConfirmModal
          item={itemToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
          }}
        />
      )}
    </div>
  );
};

// ==================== STATISTICS CARD ====================
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 bg-[#FFD54F] rounded-xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#800000]" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};

// ==================== BILLING ITEM FORM ====================
const BillingItemForm = ({ item, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    item_code: item?.item_code || "",
    item_name: item?.item_name || "",
    description: item?.description || "",
    category: item?.category || "hall",
    internal_price: item?.internal_price || "",
    external_price: item?.external_price || "",
    unit: item?.unit || "unit",
    is_active: item?.is_active ?? true,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "hall", label: "Hall Rental" },
    { value: "equipment", label: "Equipment" },
    { value: "furniture", label: "Furniture" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.item_code.trim())
      newErrors.item_code = "Item code is required";
    if (!formData.item_name.trim())
      newErrors.item_name = "Item name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.internal_price || formData.internal_price < 0)
      newErrors.internal_price = "Valid internal price is required";
    if (!formData.external_price || formData.external_price < 0)
      newErrors.external_price = "Valid external price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide border-l-4 border-[#FFD54F] pl-3">
              {item ? "Edit Billing Item" : "Add New Billing Item"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-[#FFF8F6]"
        >
          {/* Item Code & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Item Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_code"
                value={formData.item_code}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.item_code ? "border-red-500" : "border-[#FFD54F]/50"
                } rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium`}
                placeholder="e.g., HALL-001"
              />
              {errors.item_code && (
                <p className="text-red-500 text-sm mt-1 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.item_code}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.item_name ? "border-red-500" : "border-[#FFD54F]/50"
                } rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium`}
                placeholder="e.g., Main Hall Rental"
              />
              {errors.item_name && (
                <p className="text-red-500 text-sm mt-1 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.item_name}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium"
              placeholder="Item description..."
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 ${
                  errors.category ? "border-red-500" : "border-[#FFD54F]/50"
                } rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium`}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium"
                placeholder="e.g., per session, per item"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Internal Price (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="internal_price"
                value={formData.internal_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border-2 ${
                  errors.internal_price
                    ? "border-red-500"
                    : "border-[#FFD54F]/50"
                } rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium`}
                placeholder="0.00"
              />
              {errors.internal_price && (
                <p className="text-red-500 text-sm mt-1 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.internal_price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                External Price (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="external_price"
                value={formData.external_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border-2 ${
                  errors.external_price
                    ? "border-red-500"
                    : "border-[#FFD54F]/50"
                } rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-white font-medium`}
                placeholder="0.00"
              />
              {errors.external_price && (
                <p className="text-red-500 text-sm mt-1 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.external_price}
                </p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-[#A60000] border-gray-300 rounded focus:ring-[#FFD54F]"
            />
            <label
              htmlFor="is_active"
              className="ml-3 text-sm text-gray-700 font-bold cursor-pointer"
            >
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-[#FFD54F]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all disabled:from-gray-300 disabled:to-gray-400 flex items-center space-x-2 tracking-wide border-2 border-white"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" strokeWidth={2.5} />
                  <span>{item ? "Update" : "Create"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== VIEW MODAL ====================
const ViewModal = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-[#FFD54F]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold tracking-wide border-l-4 border-[#FFD54F] pl-3 relative">
            Billing Item Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all relative"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 bg-[#FFF8F6]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Item Code
              </label>
              <p className="text-gray-900 font-bold">{item.item_code}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Item Name
              </label>
              <p className="text-gray-900 font-bold">{item.item_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Category
              </label>
              <p className="text-gray-900 font-bold capitalize">
                {item.category}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Unit
              </label>
              <p className="text-gray-900 font-bold">{item.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Internal Price
              </label>
              <p className="text-gray-900 font-bold">
                RM {parseFloat(item.internal_price).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                External Price
              </label>
              <p className="text-gray-900 font-bold">
                RM {parseFloat(item.external_price).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Status
              </label>
              <p>
                {item.is_active ? (
                  <span className="inline-flex items-center text-green-600 font-bold">
                    <CheckCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-600 font-bold">
                    <XCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                    Inactive
                  </span>
                )}
              </p>
            </div>
          </div>

          {item.description && (
            <div>
              <label className="text-sm text-gray-600 font-semibold">
                Description
              </label>
              <p className="text-gray-900 font-medium">{item.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-[#FFF8F6] border-t-2 border-[#FFD54F]/30 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all tracking-wide"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== DELETE CONFIRM MODAL ====================
const DeleteConfirmModal = ({ item, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-red-300">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Trash2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
            Delete Billing Item
          </h3>
          <p className="text-gray-600 text-center mb-6 font-medium">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#A60000]">"{item.item_name}"</span>
            ? This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all tracking-wide"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-red-500/40 transition-all flex items-center justify-center space-x-2 tracking-wide"
            >
              <Trash2 className="w-5 h-5" strokeWidth={2.5} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingItems;
