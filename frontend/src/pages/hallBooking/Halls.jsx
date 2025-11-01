// src/pages/hallBooking/Halls.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHalls,
  createHall, // ✅ ADD
  updateHall, // ✅ ADD
  deleteHall, // ✅ ADD
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
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import api from "../../services/api";

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
  const [deleteLoading, setDeleteLoading] = useState(false);
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
        await dispatch(deleteHall(hallToDelete.id)).unwrap(); // ✅ USE REDUX THUNK
        setShowDeleteConfirm(false);
        setHallToDelete(null);
        // ✅ NO NEED TO REFETCH - reducer updates state automatically
        // ✅ NO NEED TO SET ERROR - toast handles it
      } catch (err) {
        console.error("Failed to delete hall:", err);
        // Toast already shows error from slice
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Halls Management
              </h1>
              <p className="text-indigo-100">Manage venue halls and pricing</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {statistics.total} Total Halls
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Total Halls</p>
                <p className="text-2xl font-bold mt-1">{statistics.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-indigo-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Active</p>
                <p className="text-2xl font-bold mt-1">{statistics.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-indigo-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Inactive</p>
                <p className="text-2xl font-bold mt-1">{statistics.inactive}</p>
              </div>
              <XCircle className="w-8 h-8 text-indigo-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 text-red-600 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error || localError}</p>
            </div>
          </div>
          <button
            onClick={() => setLocalError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900">All Halls</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Hall</span>
            </button>
          </div>
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
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewHallModal = ({ hall, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Hall Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
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
                      ? "text-green-600 font-semibold"
                      : "text-gray-600"
                  }
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Internal Price (Members)
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    RM {parseFloat(hall.internal_price).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    External Price (Non-Members)
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    RM {parseFloat(hall.external_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(hall.description || hall.facilities) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
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

        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Hall?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{hall.hall_name}</span>? This action
            cannot be undone.
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

export default Halls;
