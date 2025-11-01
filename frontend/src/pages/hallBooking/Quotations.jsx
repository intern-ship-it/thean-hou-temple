// src/pages/hallBooking/Quotations.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchQuotations,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  acceptQuotation,
  fetchQuotationById,
  setStatus,
  clearFilters,
  clearError,
  clearCurrentQuotation,
} from "../../features/hallBooking/quotationsSlice";
import QuotationsTable from "../../components/hallBooking/QuotationsTable";
import QuotationForm from "../../components/hallBooking/QuotationForm";
import {
  Plus,
  Download,
  RefreshCw,
  FileText,
  Eye,
  X,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { showToast } from "../../utils/toast";
const Quotations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quotations, loading, error, pagination, filters } = useSelector(
    (state) => state.quotations
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewQuotation, setViewQuotation] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [quotationToAccept, setQuotationToAccept] = useState(null);

  // Calculate statistics from quotations
  const calculateStats = () => {
    const stats = {
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      expired: 0,
    };

    quotations.forEach((q) => {
      if (q.status === "sent" && new Date(q.valid_until) < new Date()) {
        stats.expired++;
      } else {
        stats[q.status] = (stats[q.status] || 0) + 1;
      }
    });

    return stats;
  };

  const statistics = calculateStats();

  useEffect(() => {
    dispatch(fetchQuotations({ page: 1, status: filters.status }));
  }, [dispatch, filters.status]);

  const handleStatusFilter = (status) => {
    dispatch(setStatus(status));
  };

  const handleRefresh = () => {
    dispatch(
      fetchQuotations({ page: pagination.currentPage, status: filters.status })
    );
  };

  const handleAdd = () => {
    dispatch(clearCurrentQuotation());
    setSelectedQuotation(null);
    setShowForm(true);
  };

  const handleEdit = async (quotation) => {
    await dispatch(fetchQuotationById(quotation.id));
    setSelectedQuotation(quotation);
    setShowForm(true);
  };

  const handleView = async (quotation) => {
    await dispatch(fetchQuotationById(quotation.id));
    setViewQuotation(quotation);
    setShowViewModal(true);
  };

  const handleDelete = (quotation) => {
    setQuotationToDelete(quotation);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (quotationToDelete) {
      await dispatch(deleteQuotation(quotationToDelete.id));
      setShowDeleteConfirm(false);
      setQuotationToDelete(null);
    }
  };

  const handleAccept = (quotation) => {
    setQuotationToAccept(quotation);
    setShowAcceptConfirm(true);
  };

 const confirmAccept = async () => {
   if (quotationToAccept) {
     try {
       const result = await dispatch(
         acceptQuotation(quotationToAccept.id)
       ).unwrap();
       setShowAcceptConfirm(false);
       setQuotationToAccept(null);

       // ✅ REPLACED: Old code was alert(`Quotation accepted! Booking ${result.data.booking_code} created successfully.`);
       // ✅ NEW: Use toast instead
       showToast.success(
         "toast.quotations.accept_success",
         {},
         {
           code: result.data.booking_code,
         }
       );

       // Small delay before navigation so user can see the toast
       setTimeout(() => {
         navigate("/hall/bookings");
       }, 500);
     } catch (err) {
       console.error("Failed to accept quotation:", err);
       // Error toast is already shown by the slice
     }
   }
 };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedQuotation) {
        await dispatch(
          updateQuotation({ id: selectedQuotation.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createQuotation(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedQuotation(null);
      dispatch(
        fetchQuotations({
          page: pagination.currentPage,
          status: filters.status,
        })
      );
    } catch (err) {
      console.error("Failed to save quotation:", err);
    }
  };

  const handlePageChange = (page) => {
    dispatch(fetchQuotations({ page, status: filters.status }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Quotations Management
              </h1>
              <p className="text-green-100">
                Generate and manage customer quotations
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <FileText className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {pagination.total} Total Quotations
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Draft</p>
                <p className="text-2xl font-bold mt-1">{statistics.draft}</p>
              </div>
              <FileText className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Sent</p>
                <p className="text-2xl font-bold mt-1">{statistics.sent}</p>
              </div>
              <Clock className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Accepted</p>
                <p className="text-2xl font-bold mt-1">{statistics.accepted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Rejected</p>
                <p className="text-2xl font-bold mt-1">{statistics.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Expired</p>
                <p className="text-2xl font-bold mt-1">{statistics.expired}</p>
              </div>
              <XCircle className="w-8 h-8 text-green-200" />
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleStatusFilter("")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("draft")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "draft"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => handleStatusFilter("sent")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "sent"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => handleStatusFilter("accepted")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "accepted"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => handleStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === "rejected"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
          </div>

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
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">New Quotation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {filters.status && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-blue-800">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Active Filters:</span>
            <span className="px-2 py-1 bg-blue-100 rounded capitalize">
              Status: {filters.status}
            </span>
          </div>
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Table */}
      <QuotationsTable
        quotations={quotations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onAccept={handleAccept}
      />

      {/* Pagination */}
      {pagination.lastPage > 1 && (
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
              quotations
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                {[...Array(pagination.lastPage)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === pagination.lastPage ||
                    (page >= pagination.currentPage - 1 &&
                      page <= pagination.currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          pagination.currentPage === page
                            ? "bg-green-600 text-white"
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
                disabled={pagination.currentPage === pagination.lastPage}
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
        <QuotationForm
          quotation={selectedQuotation}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedQuotation(null);
          }}
          loading={loading}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewQuotation && (
        <ViewQuotationModal
          quotation={viewQuotation}
          onClose={() => {
            setShowViewModal(false);
            setViewQuotation(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEdit(viewQuotation);
          }}
          onAccept={() => {
            setShowViewModal(false);
            handleAccept(viewQuotation);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && quotationToDelete && (
        <DeleteConfirmModal
          quotation={quotationToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setQuotationToDelete(null);
          }}
          loading={loading}
        />
      )}

      {/* Accept Confirmation */}
      {showAcceptConfirm && quotationToAccept && (
        <AcceptConfirmModal
          quotation={quotationToAccept}
          onConfirm={confirmAccept}
          onCancel={() => {
            setShowAcceptConfirm(false);
            setQuotationToAccept(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewQuotationModal = ({ quotation, onClose, onEdit, onAccept }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = new Date(quotation.valid_until) < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Quotation Details</h2>
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
                <InfoField
                  label="Quotation Code"
                  value={quotation.quotation_code}
                />
                <InfoField
                  label="Status"
                  value={quotation.status}
                  className="capitalize"
                />
                <InfoField
                  label="Type"
                  value={
                    quotation.quotation_type === "dinner_package"
                      ? "Dinner Package"
                      : "Standard"
                  }
                />
                <InfoField
                  label="Customer"
                  value={quotation.customer?.name_english}
                />
                <InfoField label="Hall" value={quotation.hall?.hall_name} />
                <InfoField
                  label="Event Date"
                  value={formatDate(quotation.event_date)}
                />
                <InfoField
                  label="Valid Until"
                  value={formatDate(quotation.valid_until)}
                  className={
                    isExpired && quotation.status === "sent"
                      ? "text-red-600"
                      : ""
                  }
                />
                <InfoField
                  label="Total Amount"
                  value={`RM ${parseFloat(quotation.total_amount).toFixed(2)}`}
                />
              </div>
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notes
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {quotation.notes}
                </p>
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
          {quotation.status === "draft" && (
            <button
              onClick={onEdit}
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit Quotation
            </button>
          )}
          {quotation.status === "sent" && !isExpired && (
            <button
              onClick={onAccept}
              className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Accept & Create Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ quotation, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Quotation?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete quotation{" "}
            <span className="font-semibold">{quotation.quotation_code}</span>?
            This action cannot be undone.
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

// Accept Confirmation Modal
const AcceptConfirmModal = ({ quotation, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Accept Quotation?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            This will accept quotation{" "}
            <span className="font-semibold">{quotation.quotation_code}</span>{" "}
            and automatically create a booking. Do you want to proceed?
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
            className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Accept & Create Booking"}
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

export default Quotations;
