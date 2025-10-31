// src/pages/hallBooking/CateringVendors.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCateringVendors,
  createCateringVendor,
  updateCateringVendor,
  deleteCateringVendor,
  setVendorType,
} from "../../features/hallBooking/cateringVendorsSlice";
import {
  Plus,
  RefreshCw,
  ChefHat,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Phone,
  Mail,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Leaf,
  Drumstick,
} from "lucide-react";

const CateringVendors = () => {
  const dispatch = useDispatch();
  const { vendors, loading, error, filters } = useSelector(
    (state) => state.cateringVendors
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Vendor types
  const vendorTypes = [
    { value: "", label: "All Types" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "non_vegetarian", label: "Non-Vegetarian" },
  ];

  // Statistics
  const statistics = {
    total: vendors.length,
    active: vendors.filter((v) => v.is_active).length,
    inactive: vendors.filter((v) => !v.is_active).length,
    vegetarian: vendors.filter((v) => v.vendor_type === "vegetarian").length,
    non_vegetarian: vendors.filter((v) => v.vendor_type === "non_vegetarian")
      .length,
  };

  useEffect(() => {
    dispatch(fetchCateringVendors({ vendor_type: filters.vendor_type }));
  }, [dispatch, filters.vendor_type]);

  const handleRefresh = () => {
    dispatch(fetchCateringVendors({ vendor_type: filters.vendor_type }));
  };

  const handleVendorTypeChange = (type) => {
    dispatch(setVendorType(type));
  };

  const handleAdd = () => {
    setSelectedVendor(null);
    setShowForm(true);
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setShowForm(true);
  };

  const handleView = (vendor) => {
    setViewVendor(vendor);
    setShowViewModal(true);
  };

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (vendorToDelete) {
      try {
        await dispatch(deleteCateringVendor(vendorToDelete.id)).unwrap();
        setShowDeleteConfirm(false);
        setVendorToDelete(null);
      } catch (err) {
        console.error("Failed to delete vendor:", err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedVendor) {
        await dispatch(
          updateCateringVendor({ id: selectedVendor.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createCateringVendor(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedVendor(null);
    } catch (err) {
      console.error("Failed to save vendor:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter vendors by search
  const filteredVendors = vendors.filter((vendor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vendor.vendor_name.toLowerCase().includes(searchLower) ||
      (vendor.vendor_name_chinese &&
        vendor.vendor_name_chinese.toLowerCase().includes(searchLower)) ||
      (vendor.contact_person &&
        vendor.contact_person.toLowerCase().includes(searchLower)) ||
      (vendor.contact_number &&
        vendor.contact_number.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header - TEMPLE THEME */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 rounded-xl p-6 sm:p-8 text-white shadow-lg border-2 border-amber-400">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-red-900" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Catering Vendors
              </h1>
              <p className="text-amber-100">
                Manage approved catering vendors for dinner packages
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-amber-100 text-sm">Total Vendors:</span>
              <span className="text-3xl font-bold text-amber-300">
                {statistics.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards - TEMPLE THEME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Vendors"
          value={statistics.total}
          icon={ChefHat}
          color="red"
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
          color="gray"
        />
        <StatCard
          title="Vegetarian"
          value={statistics.vegetarian}
          icon={Leaf}
          color="lime"
        />
        <StatCard
          title="Non-Vegetarian"
          value={statistics.non_vegetarian}
          icon={Drumstick}
          color="orange"
        />
      </div>

      {/* Filters & Actions - TEMPLE THEME */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-amber-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type="text"
              placeholder="Search by name, contact, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-amber-600/50"
            />
          </div>

          {/* Vendor Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-amber-600" />
            <select
              value={filters.vendor_type}
              onChange={(e) => handleVendorTypeChange(e.target.value)}
              className="px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-700 font-medium"
            >
              {vendorTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2.5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50 flex items-center space-x-2 border-2 border-amber-300 font-semibold"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center space-x-2 shadow-lg border-2 border-red-800 font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vendor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center space-x-2 text-red-700">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Table - TEMPLE THEME */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-amber-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              No catering vendors found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-50 to-amber-50 border-b-2 border-amber-300">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Vendor Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-red-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {vendor.vendor_name}
                        </div>
                        {vendor.vendor_name_chinese && (
                          <div className="text-sm text-amber-700 font-medium">
                            {vendor.vendor_name_chinese}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.vendor_type === "vegetarian" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                          <Leaf className="w-3 h-3 mr-1" />
                          Vegetarian
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                          <Drumstick className="w-3 h-3 mr-1" />
                          Non-Vegetarian
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700 font-medium">
                        <User className="w-4 h-4 mr-2 text-amber-600" />
                        {vendor.contact_person || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700 font-medium">
                        <Phone className="w-4 h-4 mr-2 text-amber-600" />
                        {vendor.contact_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.is_active ? (
                        <span className="flex items-center text-green-600 text-sm font-semibold">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500 text-sm font-semibold">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(vendor)}
                          className="p-2 text-amber-700 hover:text-red-700 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-300"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(vendor)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-300"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-300"
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
        <VendorForm
          vendor={selectedVendor}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedVendor(null);
          }}
          loading={formLoading}
        />
      )}

      {showViewModal && viewVendor && (
        <ViewModal
          vendor={viewVendor}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showDeleteConfirm && vendorToDelete && (
        <DeleteConfirmModal
          vendor={vendorToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setVendorToDelete(null);
          }}
        />
      )}
    </div>
  );
};

// ==================== STATISTICS CARD - TEMPLE THEME ====================
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    red: "from-red-500 to-red-600 text-white border-red-700",
    green: "from-green-500 to-green-600 text-white border-green-700",
    gray: "from-gray-400 to-gray-500 text-white border-gray-600",
    lime: "from-lime-500 to-lime-600 text-white border-lime-700",
    orange: "from-orange-500 to-orange-600 text-white border-orange-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-amber-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1 font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorClasses[color]} border-2 shadow-lg`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// ==================== VENDOR FORM - TEMPLE THEME ====================
const VendorForm = ({ vendor, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    vendor_name: vendor?.vendor_name || "",
    vendor_name_chinese: vendor?.vendor_name_chinese || "",
    vendor_type: vendor?.vendor_type || "non_vegetarian",
    contact_person: vendor?.contact_person || "",
    contact_number: vendor?.contact_number || "",
    email: vendor?.email || "",
    address: vendor?.address || "",
    remarks: vendor?.remarks || "",
    is_active: vendor?.is_active ?? true,
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.vendor_name.trim()) {
      newErrors.vendor_name = "Vendor name is required";
    }
    if (!formData.vendor_type) {
      newErrors.vendor_type = "Vendor type is required";
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
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-400">
        {/* Header - TEMPLE THEME */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 via-red-700 to-amber-600 border-b-4 border-amber-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {vendor ? "Edit Catering Vendor" : "Add New Catering Vendor"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200 transition-colors p-1 hover:bg-white/20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vendor Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Vendor Name (English) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="vendor_name"
                value={formData.vendor_name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border-2 ${
                  errors.vendor_name ? "border-red-400" : "border-amber-300"
                } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium`}
                placeholder="e.g., Golden Dragon Restaurant"
              />
              {errors.vendor_name && (
                <p className="text-red-600 text-sm mt-1 font-semibold">
                  {errors.vendor_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Vendor Name (Chinese)
              </label>
              <input
                type="text"
                name="vendor_name_chinese"
                value={formData.vendor_name_chinese}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                placeholder="e.g., 金龙餐厅"
              />
            </div>
          </div>

          {/* Vendor Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Vendor Type <span className="text-red-600">*</span>
            </label>
            <select
              name="vendor_type"
              value={formData.vendor_type}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 ${
                errors.vendor_type ? "border-red-400" : "border-amber-300"
              } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium`}
            >
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="vegetarian">Vegetarian</option>
            </select>
            {errors.vendor_type && (
              <p className="text-red-600 text-sm mt-1 font-semibold">
                {errors.vendor_type}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                placeholder="e.g., Manager Tan"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
                placeholder="e.g., 03-12345678"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
              placeholder="vendor@example.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
              placeholder="Full address..."
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2.5 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
              placeholder="Additional notes..."
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-red-600 border-2 border-amber-400 rounded focus:ring-red-500"
            />
            <label
              htmlFor="is_active"
              className="ml-3 text-sm text-gray-700 cursor-pointer font-semibold"
            >
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold border-2 border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 flex items-center space-x-2 shadow-lg border-2 border-red-800 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  <span>{vendor ? "Update" : "Create"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== VIEW MODAL - TEMPLE THEME ====================
const ViewModal = ({ vendor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-4 border-amber-400">
        {/* Header - TEMPLE THEME */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-amber-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between border-b-4 border-amber-400">
          <h2 className="text-xl font-bold">Catering Vendor Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200 transition-colors p-1 hover:bg-white/20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Vendor Name
              </label>
              <p className="text-gray-900 font-semibold">
                {vendor.vendor_name}
              </p>
              {vendor.vendor_name_chinese && (
                <p className="text-amber-700 text-sm font-medium">
                  {vendor.vendor_name_chinese}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Vendor Type
              </label>
              <p>
                {vendor.vendor_type === "vegetarian" ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border-2 border-green-300">
                    <Leaf className="w-4 h-4 mr-1" />
                    Vegetarian
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-800 border-2 border-orange-300">
                    <Drumstick className="w-4 h-4 mr-1" />
                    Non-Vegetarian
                  </span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Contact Person
              </label>
              <p className="text-gray-900 font-semibold">
                {vendor.contact_person || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Contact Number
              </label>
              <p className="text-gray-900 font-semibold">
                {vendor.contact_number || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-amber-700 font-bold">Email</label>
              <p className="text-gray-900 font-semibold">
                {vendor.email || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-amber-700 font-bold">Status</label>
              <p>
                {vendor.is_active ? (
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center text-gray-500 font-semibold">
                    <XCircle className="w-5 h-5 mr-1" />
                    Inactive
                  </span>
                )}
              </p>
            </div>
          </div>

          {vendor.address && (
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Address
              </label>
              <p className="text-gray-900 font-medium">{vendor.address}</p>
            </div>
          )}

          {vendor.remarks && (
            <div>
              <label className="text-sm text-amber-700 font-bold">
                Remarks
              </label>
              <p className="text-gray-900 font-medium">{vendor.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-amber-50 px-6 py-4 rounded-b-lg flex justify-end border-t-2 border-amber-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== DELETE CONFIRM MODAL - TEMPLE THEME ====================
const DeleteConfirmModal = ({ vendor, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-4 border-red-400">
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 border-4 border-red-300">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Catering Vendor
          </h3>
          <p className="text-gray-600 text-center mb-6 font-medium">
            Are you sure you want to delete "
            <span className="font-bold text-red-600">{vendor.vendor_name}</span>
            "? This action cannot be undone.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold border-2 border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg border-2 border-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringVendors;
