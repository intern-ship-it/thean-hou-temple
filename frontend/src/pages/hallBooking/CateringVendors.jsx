// src/pages/masterSetup/CateringVendors.jsx - Clean White UI - FIXED
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCateringVendors,
  deleteCateringVendor,
} from "../../features/hallBooking/cateringVendorsSlice";
import {
  ChefHat,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Phone,
  Mail,
  MapPin,
  Check,
} from "lucide-react";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

const CateringVendors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ✅ FIXED: Access vendors array correctly
  const { vendors: cateringVendors, loading } = useSelector(
    (state) => state.cateringVendors
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    dispatch(fetchCateringVendors({ per_page: 100 }));
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;

    try {
      await dispatch(deleteCateringVendor(vendorToDelete.id)).unwrap();
      showToast.success("Catering vendor deleted successfully");
      setShowDeleteModal(false);
      setVendorToDelete(null);
      loadVendors();
    } catch (error) {
      showToast.error(error.message || "Failed to delete catering vendor");
    }
  };

  // ✅ FIXED: Added safety check
  const filteredVendors = (cateringVendors || []).filter(
    (vendor) =>
      searchQuery === "" ||
      vendor.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contact_person
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vendor.phone?.includes(searchQuery)
  );

  // ✅ FIXED: Added safety check
  const stats = {
    total: cateringVendors?.length || 0,
    active: cateringVendors?.filter((v) => v.is_active).length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <ChefHat className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Catering Vendors
              </h1>
              <p className="text-gray-600 mt-1">
                Manage approved catering vendors
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/hall/catering-vendors/create")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Vendor
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Vendors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ChefHat className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Vendors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search catering vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={loadVendors}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg text-gray-500">
          <ChefHat className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg">No catering vendors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Vendor Header */}
              <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {vendor.vendor_name}
                    </h3>
                  </div>
                  {vendor.is_active && (
                    <div className="px-2 py-1 bg-green-500 rounded-full">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Vendor Details */}
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-900">{vendor.phone}</span>
                </div>

                {vendor.email && (
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-900">{vendor.email}</span>
                  </div>
                )}

                {vendor.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{vendor.address}</span>
                  </div>
                )}

                {vendor.contact_person && (
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <span className="text-xs text-gray-500">
                      Contact Person:
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {vendor.contact_person}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-gray-200 pt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/hall/catering-vendors/${vendor.id}/edit`)
                    }
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setVendorToDelete(vendor);
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
              <strong>{vendorToDelete?.vendor_name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVendorToDelete(null);
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
      {showDetailsModal && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Vendor Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedVendor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vendor Name
                </label>
                <p className="text-gray-900 mt-1">
                  {selectedVendor.vendor_name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900 mt-1">{selectedVendor.phone}</p>
                </div>
                {selectedVendor.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{selectedVendor.email}</p>
                  </div>
                )}
              </div>

              {selectedVendor.contact_person && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Person
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedVendor.contact_person}
                  </p>
                </div>
              )}

              {selectedVendor.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Address
                  </label>
                  <p className="text-gray-900 mt-1">{selectedVendor.address}</p>
                </div>
              )}

              {selectedVendor.vendor_type && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Vendor Type
                  </label>
                  <p className="mt-1">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedVendor.vendor_type}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1">
                  {selectedVendor.is_active ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3" />
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
                  setSelectedVendor(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/hall/catering-vendors/${selectedVendor.id}/edit`);
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

export default CateringVendors;
