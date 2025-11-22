// src/pages/masterSetup/DinnerPackages.jsx - CORRECT FIELD NAMES!
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDinnerPackages,
  deleteDinnerPackage,
} from "../../features/hallBooking/dinnerPackagesSlice";
import {
  Utensils,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  DollarSign,
  Users,
} from "lucide-react";
import { showToast } from "../../utils/toast";

const DinnerPackages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ CORRECT: packages from Redux
  const { packages: dinnerPackages, loading } = useSelector(
    (state) => state.dinnerPackages
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    loadDinnerPackages();
  }, []);

  const loadDinnerPackages = () => {
    dispatch(fetchDinnerPackages());
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;

    try {
      await dispatch(deleteDinnerPackage(packageToDelete.id)).unwrap();
      showToast.success("Dinner package deleted successfully");
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadDinnerPackages();
    } catch (error) {
      showToast.error(error.message || "Failed to delete dinner package");
    }
  };

  const filteredPackages = (dinnerPackages || []).filter(
    (pkg) =>
      searchQuery === "" ||
      pkg.package_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Utensils className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dinner Packages
              </h1>
              <p className="text-gray-600 mt-1">
                Manage dinner packages and pricing
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/hall/dinner-packages/create")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Package
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search dinner packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={loadDinnerPackages}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg text-gray-500">
          <Utensils className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg">No dinner packages found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Package Header */}
              <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {pkg.package_name}
                  </h3>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-6 space-y-4">
                {pkg.description && (
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Min Tables</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {pkg.minimum_tables || "N/A"}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Price per Table
                    </span>
                    <div className="flex items-center gap-1 text-xl font-bold text-red-600">
                      <DollarSign className="w-5 h-5" />
                      <span>
                        RM {parseFloat(pkg.price_per_table || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/hall/dinner-packages/${pkg.id}/edit`)
                    }
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setPackageToDelete(pkg);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{packageToDelete?.package_name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPackageToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Package Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPackage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Package Code
                </label>
                <p className="text-gray-900 mt-1">
                  {selectedPackage.package_code}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Package Name
                </label>
                <p className="text-gray-900 mt-1">
                  {selectedPackage.package_name}
                </p>
              </div>

              {selectedPackage.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedPackage.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Price per Table
                  </label>
                  <p className="text-lg font-bold text-red-600 mt-1">
                    RM{" "}
                    {parseFloat(selectedPackage.price_per_table || 0).toFixed(
                      2
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Minimum Tables
                  </label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selectedPackage.minimum_tables || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1">
                  {selectedPackage.is_active ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPackage(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/hall/dinner-packages/${selectedPackage.id}/edit`);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DinnerPackages;
