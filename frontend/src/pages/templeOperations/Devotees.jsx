// src/pages/templeOperations/Devotees.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDevotees,
  createDevotee,
  updateDevotee,
  deleteDevotee,
  setSearch,
  clearError,
} from "../../features/templeOperations/devoteesSlice";
import DevoteesTable from "./DevoteesTable";
import DevoteeForm from "./DevoteeForm";
import {
  Plus,
  Search,
  Download,
  Upload,
  Filter,
  RefreshCw,
  Users,
  Eye,
  X,
  Trash2,
} from "lucide-react";

const Devotees = () => {
  const dispatch = useDispatch();
  const { devotees, loading, error, pagination, filters } = useSelector(
    (state) => state.devotees
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedDevotee, setSelectedDevotee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDevotee, setViewDevotee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [devoteeToDelete, setDevoteeToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(fetchDevotees({ page: 1, search: filters.search }));
  }, [dispatch, filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  const handleRefresh = () => {
    dispatch(
      fetchDevotees({ page: pagination.currentPage, search: filters.search })
    );
  };

  const handleAdd = () => {
    setSelectedDevotee(null);
    setShowForm(true);
  };

  const handleEdit = (devotee) => {
    setSelectedDevotee(devotee);
    setShowForm(true);
  };

  const handleView = (devotee) => {
    setViewDevotee(devotee);
    setShowViewModal(true);
  };

  const handleDelete = (devotee) => {
    setDevoteeToDelete(devotee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (devoteeToDelete) {
      await dispatch(deleteDevotee(devoteeToDelete.id));
      setShowDeleteConfirm(false);
      setDevoteeToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedDevotee) {
        await dispatch(
          updateDevotee({ id: selectedDevotee.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createDevotee(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedDevotee(null);
      dispatch(
        fetchDevotees({ page: pagination.currentPage, search: filters.search })
      );
    } catch (err) {
      console.error("Failed to save devotee:", err);
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchDevotees({ page, search: filters.search }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Devotees Management
              </h1>
              <p className="text-primary-100">
                Manage temple devotees and their information
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {pagination.total} Total Devotees
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 text-red-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, IC, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Export"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Export</span>
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Import"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Import</span>
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Devotee</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DevoteesTable
        devotees={devotees}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.currentPage - 1) * pagination.perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{" "}
              devotees
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center space-x-2">
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.currentPage === page
                            ? "bg-primary-800 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <DevoteeForm
          devotee={selectedDevotee}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedDevotee(null);
          }}
          loading={loading}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewDevotee && (
        <ViewDevoteeModal
          devotee={viewDevotee}
          onClose={() => {
            setShowViewModal(false);
            setViewDevotee(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEdit(viewDevotee);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && devoteeToDelete && (
        <DeleteConfirmModal
          devotee={devoteeToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDevoteeToDelete(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewDevoteeModal = ({ devotee, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Devotee Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField label="Devotee Code" value={devotee.devotee_code} />
            <InfoField
              label="Status"
              value={devotee.is_active ? "Active" : "Inactive"}
            />
            <InfoField label="Name (English)" value={devotee.name_english} />
            <InfoField
              label="Name (Chinese)"
              value={devotee.name_chinese || "-"}
            />
            <InfoField label="IC Number" value={devotee.ic_number} />
            <InfoField label="Phone" value={devotee.phone} />
            <InfoField label="Email" value={devotee.email || "-"} />
            <InfoField
              label="Date of Birth"
              value={devotee.date_of_birth || "-"}
            />
            <InfoField
              label="Gender"
              value={devotee.gender}
              className="capitalize"
            />
            <div className="md:col-span-2">
              <InfoField label="Address" value={devotee.address || "-"} />
            </div>
            <InfoField label="City" value={devotee.city} />
            <InfoField label="State" value={devotee.state} />
            <InfoField label="Postcode" value={devotee.postcode || "-"} />
            <InfoField label="Country" value={devotee.country} />
            {devotee.notes && (
              <div className="md:col-span-2">
                <InfoField label="Notes" value={devotee.notes} />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2.5 bg-primary-800 text-white font-medium rounded-lg hover:bg-primary-900 transition-colors"
          >
            Edit Devotee
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ devotee, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Devotee?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{devotee.name_english}</span>? This
            action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Info Field Component
const InfoField = ({ label, value, className = "" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">
      {label}
    </label>
    <p className={`text-gray-900 ${className}`}>{value}</p>
  </div>
);

export default Devotees;
