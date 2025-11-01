// src/pages/templeOperations/Devotees.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // ADD THIS
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
  const { t } = useTranslation(); // ADD THIS
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
    dispatch(fetchDevotees({ page: pagination.currentPage, search: filters.search }));
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
      dispatch(fetchDevotees({ page: pagination.currentPage, search: filters.search }));
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
                {t("devotees_page.title")}
              </h1>
              <p className="text-primary-100">{t("devotees_page.subtitle")}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {pagination.total} {t("devotees_page.total_devotees")}
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
              <h3 className="text-sm font-semibold text-red-800">{t("forms.error")}</h3>
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
                placeholder={t("devotees_page.search_devotees")}
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
              title={t("devotees_page.refresh")}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={t("table.export")}
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">{t("table.export")}</span>
            </button>
            <button
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={t("devotees_page.import")}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">{t("devotees_page.import")}</span>
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 px-4 py-2.5 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">{t("devotees_page.add_devotee")}</span>
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
              {t("table.showing", {
                from: (pagination.currentPage - 1) * pagination.perPage + 1,
                to: Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                ),
                total: pagination.total,
              })}
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("table.previous")}
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
                {t("table.next")}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("devotees_page.devotee_details")}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Display devotee details here */}
              <p className="text-gray-600">Devotee details content...</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && devoteeToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t("devotees_page.delete_devotee")}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              {t("forms.confirm_delete")} {devoteeToDelete.name_english}?
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDevoteeToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("forms.cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t("forms.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devotees;
