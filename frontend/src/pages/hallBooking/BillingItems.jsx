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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Billing Items
              </h1>
              <p className="text-indigo-100">
                Manage hall booking billing items and pricing
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-indigo-100 text-sm">Total Items:</span>
              <span className="text-2xl font-bold">{statistics.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Items"
          value={statistics.total}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active"
          value={statistics.active}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Inactive"
          value={statistics.inactive}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Hall Items"
          value={statistics.hall}
          icon={Tag}
          color="purple"
        />
        <StatCard
          title="Equipment"
          value={statistics.equipment}
          icon={Package}
          color="orange"
        />
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No billing items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internal Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    External Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.item_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.item_code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1" />
                        RM {parseFloat(item.internal_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900">
                        <DollarSign className="w-4 h-4 mr-1" />
                        RM {parseFloat(item.external_price).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{item.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
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
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.item_code.trim()) {
      newErrors.item_code = "Item code is required";
    }
    if (!formData.item_name.trim()) {
      newErrors.item_name = "Item name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.internal_price || formData.internal_price < 0) {
      newErrors.internal_price = "Valid internal price is required";
    }
    if (!formData.external_price || formData.external_price < 0) {
      newErrors.external_price = "Valid external price is required";
    }

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? "Edit Billing Item" : "Add New Billing Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Code & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_code"
                value={formData.item_code}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.item_code ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="e.g., HALL-001"
              />
              {errors.item_code && (
                <p className="text-red-500 text-sm mt-1">{errors.item_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.item_name ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="e.g., Main Hall Rental"
              />
              {errors.item_name && (
                <p className="text-red-500 text-sm mt-1">{errors.item_name}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Item description..."
            />
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.category ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., per session, per item"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Internal Price (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="internal_price"
                value={formData.internal_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border ${
                  errors.internal_price ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="0.00"
              />
              {errors.internal_price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.internal_price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External Price (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="external_price"
                value={formData.external_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border ${
                  errors.external_price ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="0.00"
              />
              {errors.external_price && (
                <p className="text-red-500 text-sm mt-1">
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
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Billing Item Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Item Code</label>
              <p className="text-gray-900 font-medium">{item.item_code}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Item Name</label>
              <p className="text-gray-900 font-medium">{item.item_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <p className="text-gray-900 font-medium capitalize">
                {item.category}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Unit</label>
              <p className="text-gray-900 font-medium">{item.unit}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Internal Price</label>
              <p className="text-gray-900 font-medium">
                RM {parseFloat(item.internal_price).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">External Price</label>
              <p className="text-gray-900 font-medium">
                RM {parseFloat(item.external_price).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <p>
                {item.is_active ? (
                  <span className="inline-flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Inactive
                  </span>
                )}
              </p>
            </div>
          </div>

          {item.description && (
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <p className="text-gray-900">{item.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            Delete Billing Item
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "{item.item_name}"? This action
            cannot be undone.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingItems;
