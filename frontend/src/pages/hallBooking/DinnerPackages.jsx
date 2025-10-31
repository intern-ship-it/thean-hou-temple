// src/pages/hallBooking/DinnerPackages.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDinnerPackages,
  createDinnerPackage,
  updateDinnerPackage,
  deleteDinnerPackage,
  calculateTotal,
  clearCalculatedTotal,
} from "../../features/hallBooking/dinnerPackagesSlice";
import {
  Plus,
  RefreshCw,
  Utensils,
  Search,
  Edit2,
  Trash2,
  Eye,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  Calculator,
  X,
} from "lucide-react";

const DinnerPackages = () => {
  const dispatch = useDispatch();
  const { packages, loading, error } = useSelector(
    (state) => state.dinnerPackages
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewPackage, setViewPackage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Statistics
  const statistics = {
    total: packages.length,
    active: packages.filter((p) => p.is_active).length,
    inactive: packages.filter((p) => !p.is_active).length,
    avgPrice:
      packages.length > 0
        ? (
            packages.reduce(
              (sum, p) => sum + parseFloat(p.price_per_table),
              0
            ) / packages.length
          ).toFixed(2)
        : 0,
  };

  useEffect(() => {
    dispatch(fetchDinnerPackages());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDinnerPackages());
  };

  const handleAdd = () => {
    setSelectedPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg);
    setShowForm(true);
  };

  const handleView = (pkg) => {
    setViewPackage(pkg);
    setShowViewModal(true);
  };

  const handleDelete = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (packageToDelete) {
      try {
        await dispatch(deleteDinnerPackage(packageToDelete.id)).unwrap();
        setShowDeleteConfirm(false);
        setPackageToDelete(null);
      } catch (err) {
        console.error("Failed to delete package:", err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedPackage) {
        await dispatch(
          updateDinnerPackage({ id: selectedPackage.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createDinnerPackage(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedPackage(null);
    } catch (err) {
      console.error("Failed to save package:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter packages by search
  const filteredPackages = packages.filter((pkg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      pkg.package_name.toLowerCase().includes(searchLower) ||
      pkg.package_code.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Utensils className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Dinner Packages
              </h1>
              <p className="text-orange-100">
                Manage dinner package offerings and pricing
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-orange-100 text-sm">Total Packages:</span>
              <span className="text-2xl font-bold">{statistics.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Packages"
          value={statistics.total}
          icon={Utensils}
          color="orange"
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
          title="Avg Price/Table"
          value={`RM ${statistics.avgPrice}`}
          icon={DollarSign}
          color="blue"
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
              placeholder="Search by package name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCalculator(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Calculator</span>
            </button>
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Package</span>
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
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No dinner packages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price per Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Tables
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Total Cost
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
                {filteredPackages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {pkg.package_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {pkg.package_code}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-900 font-semibold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        RM {parseFloat(pkg.price_per_table).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {pkg.minimum_tables} tables
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">
                        RM{" "}
                        {(
                          parseFloat(pkg.price_per_table) * pkg.minimum_tables
                        ).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {pkg.is_active ? (
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
                          onClick={() => handleView(pkg)}
                          className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg)}
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
        <PackageForm
          package={selectedPackage}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedPackage(null);
          }}
          loading={formLoading}
        />
      )}

      {showViewModal && viewPackage && (
        <ViewModal
          package={viewPackage}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showDeleteConfirm && packageToDelete && (
        <DeleteConfirmModal
          package={packageToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setPackageToDelete(null);
          }}
        />
      )}

      {showCalculator && (
        <PriceCalculator
          packages={packages}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
};

// ==================== STATISTICS CARD ====================
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
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

// ==================== PACKAGE FORM ====================
const PackageForm = ({ package: pkg, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    package_code: pkg?.package_code || "",
    package_name: pkg?.package_name || "",
    price_per_table: pkg?.price_per_table || "",
    description: pkg?.description || "",
    minimum_tables: pkg?.minimum_tables || 50,
    is_active: pkg?.is_active ?? true,
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

    if (!formData.package_code.trim()) {
      newErrors.package_code = "Package code is required";
    }
    if (!formData.package_name.trim()) {
      newErrors.package_name = "Package name is required";
    }
    if (!formData.price_per_table || formData.price_per_table < 0) {
      newErrors.price_per_table = "Valid price per table is required";
    }
    if (!formData.minimum_tables || formData.minimum_tables < 1) {
      newErrors.minimum_tables = "Minimum tables must be at least 1";
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
            {pkg ? "Edit Dinner Package" : "Add New Dinner Package"}
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
          {/* Package Code & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="package_code"
                value={formData.package_code}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.package_code ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="e.g., PKG_A"
              />
              {errors.package_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.package_code}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="package_name"
                value={formData.package_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.package_name ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="e.g., Package A - Premium"
              />
              {errors.package_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.package_name}
                </p>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Package description..."
            />
          </div>

          {/* Price & Minimum Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Table (RM) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price_per_table"
                value={formData.price_per_table}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border ${
                  errors.price_per_table ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="0.00"
              />
              {errors.price_per_table && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price_per_table}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Tables <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minimum_tables"
                value={formData.minimum_tables}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-2 border ${
                  errors.minimum_tables ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                placeholder="50"
              />
              {errors.minimum_tables && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minimum_tables}
                </p>
              )}
            </div>
          </div>

          {/* Minimum Total Cost Display */}
          {formData.price_per_table && formData.minimum_tables && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-1">Minimum Total Cost:</p>
              <p className="text-2xl font-bold text-blue-900">
                RM{" "}
                {(
                  parseFloat(formData.price_per_table) *
                  parseInt(formData.minimum_tables)
                ).toFixed(2)}
              </p>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4" />
                  <span>{pkg ? "Update" : "Create"}</span>
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
const ViewModal = ({ package: pkg, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold">Dinner Package Details</h2>
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
              <label className="text-sm text-gray-600">Package Code</label>
              <p className="text-gray-900 font-medium">{pkg.package_code}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Package Name</label>
              <p className="text-gray-900 font-medium">{pkg.package_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Price per Table</label>
              <p className="text-gray-900 font-medium">
                RM {parseFloat(pkg.price_per_table).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Minimum Tables</label>
              <p className="text-gray-900 font-medium">
                {pkg.minimum_tables} tables
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Minimum Total Cost
              </label>
              <p className="text-gray-900 font-bold text-lg">
                RM{" "}
                {(parseFloat(pkg.price_per_table) * pkg.minimum_tables).toFixed(
                  2
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Status</label>
              <p>
                {pkg.is_active ? (
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

          {pkg.description && (
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <p className="text-gray-900">{pkg.description}</p>
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
const DeleteConfirmModal = ({ package: pkg, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
            Delete Dinner Package
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "{pkg.package_name}"? This action
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

// ==================== PRICE CALCULATOR ====================
const PriceCalculator = ({ packages, onClose }) => {
  const dispatch = useDispatch();
  const { calculatedTotal } = useSelector((state) => state.dinnerPackages);

  const [selectedPackage, setSelectedPackage] = useState("");
  const [numberOfTables, setNumberOfTables] = useState(50);

  const handleCalculate = () => {
    if (selectedPackage && numberOfTables > 0) {
      dispatch(
        calculateTotal({
          dinner_package_id: parseInt(selectedPackage),
          number_of_tables: parseInt(numberOfTables),
        })
      );
    }
  };

  const selectedPkg = packages.find((p) => p.id === parseInt(selectedPackage));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6" />
            <h2 className="text-xl font-bold">Price Calculator</h2>
          </div>
          <button
            onClick={() => {
              onClose();
              dispatch(clearCalculatedTotal());
            }}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Select Package */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a package...</option>
              {packages
                .filter((p) => p.is_active)
                .map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.package_name} - RM {pkg.price_per_table}/table
                  </option>
                ))}
            </select>
          </div>

          {/* Number of Tables */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Tables
            </label>
            <input
              type="number"
              value={numberOfTables}
              onChange={(e) => setNumberOfTables(e.target.value)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {selectedPkg && numberOfTables < selectedPkg.minimum_tables && (
              <p className="text-orange-600 text-sm mt-1">
                ⚠️ Minimum {selectedPkg.minimum_tables} tables required
              </p>
            )}
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!selectedPackage || numberOfTables < 1}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate Total</span>
          </button>

          {/* Result */}
          {calculatedTotal && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-700 mb-1">Total Amount:</p>
              <p className="text-3xl font-bold text-green-900">
                RM {parseFloat(calculatedTotal.total_amount).toFixed(2)}
              </p>
              <div className="mt-3 text-sm text-green-700 space-y-1">
                <p>Package: {calculatedTotal.package_name}</p>
                <p>
                  {calculatedTotal.number_of_tables} tables × RM{" "}
                  {parseFloat(calculatedTotal.price_per_table).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DinnerPackages;
