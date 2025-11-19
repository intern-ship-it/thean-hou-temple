// src/pages/hallBooking/Halls.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHalls,
  createHall,
  updateHall,
  deleteHall,
} from "../../features/hallBooking/hallsSlice";
import HallsTable from "../../components/hallBooking/HallsTable";
import HallForm from "../../components/hallBooking/HallForm";
import {
  Plus,
  RefreshCw,
  Building2,
  Eye,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const Halls = () => {
  const dispatch = useDispatch();
  const { halls, loading, error } = useSelector((state) => state.halls);

  const [showForm, setShowForm] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewHall, setViewHall] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Calculate statistics
  const statistics = {
    total: halls.length,
    active: halls.filter((h) => h.is_active).length,
    inactive: halls.filter((h) => !h.is_active).length,
  };

  useEffect(() => {
    dispatch(fetchHalls());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchHalls());
  };

  const handleAdd = () => {
    setSelectedHall(null);
    setShowForm(true);
  };

  const handleEdit = (hall) => {
    setSelectedHall(hall);
    setShowForm(true);
  };

  const handleView = (hall) => {
    setViewHall(hall);
    setShowViewModal(true);
  };

  const handleDelete = (hall) => {
    setHallToDelete(hall);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (hallToDelete) {
      try {
        await dispatch(deleteHall(hallToDelete.id)).unwrap();
        setShowDeleteConfirm(false);
        setHallToDelete(null);
      } catch (err) {
        console.error("Failed to delete hall:", err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setLocalError(null);

    try {
      if (selectedHall) {
        await dispatch(
          updateHall({ id: selectedHall.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createHall(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedHall(null);
    } catch (err) {
      console.error("Failed to save hall:", err);
    } finally {
      setFormLoading(false);
    }
  };

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
              <Building2 className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Halls Management
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Manage venue halls and pricing
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FFB200] text-[#800000] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FFD54F]/50 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="tracking-wide">Add Hall</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Total Halls
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.total}</p>
              </div>
              <div className="w-12 h-12 bg-[#FFD54F] rounded-xl flex items-center justify-center">
                <Building2
                  className="w-7 h-7 text-[#800000]"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Active
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
                <CheckCircle
                  className="w-7 h-7 text-green-900"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Inactive
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(error || localError) && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
            <div>
              <h3 className="text-sm font-bold text-red-800">Error</h3>
              <p className="text-sm text-red-700 font-semibold mt-1">
                {error || localError}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocalError(null)}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-5 border border-[#FFD54F]/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#800000] tracking-wide border-l-4 border-[#FFD54F] pl-3">
            All Halls
          </h2>
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

      {/* Table */}
      <HallsTable
        halls={halls}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Form Modal */}
      {showForm && (
        <HallForm
          hall={selectedHall}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedHall(null);
            setLocalError(null);
          }}
          loading={formLoading}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewHall && (
        <ViewHallModal
          hall={viewHall}
          onClose={() => {
            setShowViewModal(false);
            setViewHall(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEdit(viewHall);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && hallToDelete && (
        <DeleteConfirmModal
          hall={hallToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setHallToDelete(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewHallModal = ({ hall, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white tracking-wide border-l-4 border-[#FFD54F] pl-3">
              Hall Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="relative p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-[#FFF8F6]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-[#800000] mb-4 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Hall Code" value={hall.hall_code} />
                <InfoField label="Hall Name" value={hall.hall_name} />
                <InfoField label="Capacity" value={`${hall.capacity} people`} />
                <InfoField label="Location" value={hall.location || "-"} />
                <InfoField
                  label="Status"
                  value={hall.is_active ? "Active" : "Inactive"}
                  className={
                    hall.is_active
                      ? "text-green-600 font-bold"
                      : "text-gray-600 font-bold"
                  }
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t-2 border-[#FFD54F]/30 pt-6">
              <h3 className="text-lg font-bold text-[#800000] mb-4 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-2xl p-5 shadow-md">
                  <p className="text-sm font-bold text-green-800 mb-1">
                    Internal Price (Members)
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    RM {parseFloat(hall.internal_price).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-5 shadow-md">
                  <p className="text-sm font-bold text-blue-800 mb-1">
                    External Price (Non-Members)
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    RM {parseFloat(hall.external_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(hall.description || hall.facilities) && (
              <div className="border-t-2 border-[#FFD54F]/30 pt-6">
                <h3 className="text-lg font-bold text-[#800000] mb-4 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                  Additional Details
                </h3>
                {hall.description && (
                  <div className="mb-4">
                    <InfoField label="Description" value={hall.description} />
                  </div>
                )}
                {hall.facilities && (
                  <div>
                    <InfoField label="Facilities" value={hall.facilities} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-[#FFF8F6] border-t-2 border-[#FFD54F]/30 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all tracking-wide"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all tracking-wide border-2 border-white"
          >
            Edit Hall
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ hall, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-4 border-red-300">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Trash2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
            Delete Hall?
          </h2>
          <p className="text-gray-600 text-center mb-6 font-medium">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#A60000]">{hall.hall_name}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t-2 flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 tracking-wide"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-red-500/40 transition-all disabled:from-red-300 disabled:to-red-400 flex items-center space-x-2 tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Info Field Component
const InfoField = ({ label, value, className = "" }) => (
  <div>
    <label className="block text-sm font-bold text-gray-600 mb-1 tracking-wide">
      {label}
    </label>
    <p className={`text-gray-900 font-semibold ${className}`}>{value}</p>
  </div>
);

export default Halls;
