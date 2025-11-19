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

        showToast.success(
          "toast.quotations.accept_success",
          {},
          {
            code: result.data.booking_code,
          }
        );

        setTimeout(() => {
          navigate("/hall/bookings");
        }, 500);
      } catch (err) {
        console.error("Failed to accept quotation:", err);
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
              <FileText className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Quotations Management
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Generate and manage customer quotations
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FFB200] text-[#800000] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FFD54F]/50 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="tracking-wide">New Quotation</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="relative grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Draft
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.draft}</p>
              </div>
              <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Sent
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.sent}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-blue-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Accepted
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.accepted}</p>
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
                  Rejected
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                  Expired
                </p>
                <p className="text-3xl font-bold mt-2">{statistics.expired}</p>
              </div>
              <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
                <XCircle
                  className="w-7 h-7 text-orange-900"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
            <div>
              <h3 className="text-sm font-bold text-red-800">Error</h3>
              <p className="text-sm text-red-700 font-semibold mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-5 border border-[#FFD54F]/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleStatusFilter("")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.status === ""
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("draft")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.status === "draft"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => handleStatusFilter("sent")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.status === "sent"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => handleStatusFilter("accepted")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.status === "accepted"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => handleStatusFilter("rejected")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.status === "rejected"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
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
              className="p-2.5 text-[#A60000] hover:bg-[#FFD54F]/20 rounded-xl transition-all border border-[#FFD54F]/30"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-[#A60000] border-2 border-[#A60000] rounded-xl hover:bg-[#A60000] hover:text-white transition-all font-bold"
              title="Export"
            >
              <Download className="w-5 h-5" strokeWidth={2.5} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {filters.status && (
        <div className="bg-[#FFD54F]/20 border-2 border-[#FFD54F] rounded-2xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2 text-sm text-[#800000]">
            <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-bold">Active Filters:</span>
            <span className="px-3 py-1 bg-[#FFD54F] rounded-xl capitalize font-bold">
              Status: {filters.status}
            </span>
          </div>
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-[#A60000] hover:text-[#800000] text-sm font-bold"
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
        <div className="bg-white rounded-2xl shadow-xl p-5 border border-[#FFD54F]/20">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 font-semibold">
              Showing{" "}
              <span className="font-bold text-gray-900">
                {(pagination.currentPage - 1) * pagination.perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-gray-900">
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {pagination.total}
              </span>{" "}
              quotations
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                          pagination.currentPage === page
                            ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                            : "text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === pagination.currentPage - 2 ||
                    page === pagination.currentPage + 2
                  ) {
                    return (
                      <span key={page} className="font-bold">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white tracking-wide border-l-4 border-[#FFD54F] pl-3">
              Quotation Details
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
              <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#FFD54F] pl-3">
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
              <div className="border-t-2 border-[#FFD54F]/30 pt-6">
                <h3 className="text-lg font-bold text-[#800000] mb-4 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                  Notes
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap font-medium">
                  {quotation.notes}
                </p>
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
          {quotation.status === "draft" && (
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all tracking-wide border-2 border-white"
            >
              Edit Quotation
            </button>
          )}
          {quotation.status === "sent" && !isExpired && (
            <button
              onClick={onAccept}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/40 transition-all flex items-center space-x-2 tracking-wide"
            >
              <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-4 border-red-300">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Trash2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
            Delete Quotation?
          </h2>
          <p className="text-gray-600 text-center mb-6 font-medium">
            Are you sure you want to delete quotation{" "}
            <span className="font-bold text-[#A60000]">
              {quotation.quotation_code}
            </span>
            ? This action cannot be undone.
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

// Accept Confirmation Modal
const AcceptConfirmModal = ({ quotation, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-4 border-green-300">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
            Accept Quotation?
          </h2>
          <p className="text-gray-600 text-center mb-6 font-medium">
            This will accept quotation{" "}
            <span className="font-bold text-[#A60000]">
              {quotation.quotation_code}
            </span>{" "}
            and automatically create a booking. Do you want to proceed?
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
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:from-green-300 disabled:to-green-400 flex items-center space-x-2 tracking-wide"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                <span>Accept & Create Booking</span>
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

export default Quotations;
