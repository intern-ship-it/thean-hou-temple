// src/pages/hallBooking/Customers.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchCustomerStats,
  setSearch,
  setCustomerType,
  clearError,
} from "../../features/hallBooking/customersSlice";
import CustomersTable from "../../components/hallBooking/CustomersTable";
import CustomerForm from "../../components/hallBooking/CustomerForm";
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
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, pagination, filters, statistics } =
    useSelector((state) => state.customers);

  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(
      fetchCustomers({
        page: 1,
        search: filters.search,
        customer_type: filters.customer_type,
      })
    );
    dispatch(fetchCustomerStats());
  }, [dispatch, filters.search, filters.customer_type]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(searchInput));
  };

  const handleCustomerTypeFilter = (type) => {
    dispatch(setCustomerType(type));
  };

  const handleRefresh = () => {
    dispatch(
      fetchCustomers({
        page: pagination.currentPage,
        search: filters.search,
        customer_type: filters.customer_type,
      })
    );
    dispatch(fetchCustomerStats());
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleView = (customer) => {
    setViewCustomer(customer);
    setShowViewModal(true);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await dispatch(deleteCustomer(customerToDelete.id));
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
      dispatch(fetchCustomerStats());
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedCustomer) {
        await dispatch(
          updateCustomer({ id: selectedCustomer.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(createCustomer(formData)).unwrap();
      }
      setShowForm(false);
      setSelectedCustomer(null);
      dispatch(
        fetchCustomers({
          page: pagination.currentPage,
          search: filters.search,
          customer_type: filters.customer_type,
        })
      );
      dispatch(fetchCustomerStats());
    } catch (err) {
      console.error("Failed to save customer:", err);
    }
  };

  const handlePageChange = (page) => {
    dispatch(
      fetchCustomers({
        page,
        search: filters.search,
        customer_type: filters.customer_type,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Customers Management
              </h1>
              <p className="text-blue-100">Manage hall booking customers</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">
                {pagination.total} Total Customers
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Internal</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.internal}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">External</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.external}
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Active</p>
                  <p className="text-2xl font-bold mt-1">{statistics.active}</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">With Bookings</p>
                  <p className="text-2xl font-bold mt-1">
                    {statistics.with_bookings}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </div>
          </div>
        )}
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
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCustomerTypeFilter("")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.customer_type === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCustomerTypeFilter("internal")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.customer_type === "internal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => handleCustomerTypeFilter("external")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.customer_type === "external"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              External
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
              className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <CustomersTable
        customers={customers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
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
              customers
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
                            ? "bg-blue-600 text-white"
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
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedCustomer(null);
          }}
          loading={loading}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewCustomer && (
        <ViewCustomerModal
          customer={viewCustomer}
          onClose={() => {
            setShowViewModal(false);
            setViewCustomer(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEdit(viewCustomer);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && customerToDelete && (
        <DeleteConfirmModal
          customer={customerToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setCustomerToDelete(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

// View Modal Component
const ViewCustomerModal = ({ customer, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Customer Details</h2>
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
            <InfoField label="Customer Code" value={customer.customer_code} />
            <InfoField
              label="Customer Type"
              value={customer.customer_type}
              className="capitalize"
            />
            <InfoField label="Name (English)" value={customer.name_english} />
            <InfoField
              label="Name (Chinese)"
              value={customer.name_chinese || "-"}
            />
            <InfoField label="IC Number" value={customer.ic_number || "-"} />
            <InfoField label="Contact Person" value={customer.contact_person} />
            <InfoField label="Contact Number" value={customer.contact_number} />
            <InfoField label="Email" value={customer.email || "-"} />
            {customer.company_name && (
              <InfoField label="Company Name" value={customer.company_name} />
            )}
            <InfoField
              label="Status"
              value={customer.is_active ? "Active" : "Inactive"}
            />
            <div className="md:col-span-2">
              <InfoField label="Address" value={customer.address || "-"} />
            </div>
            <InfoField label="City" value={customer.city || "-"} />
            <InfoField label="State" value={customer.state || "-"} />
            <InfoField label="Postcode" value={customer.postcode || "-"} />
            <InfoField label="Country" value={customer.country || "-"} />
            {customer.remarks && (
              <div className="md:col-span-2">
                <InfoField label="Remarks" value={customer.remarks} />
              </div>
            )}
            <InfoField
              label="Total Bookings"
              value={customer.total_bookings || 0}
            />
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
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Customer
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ customer, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            Delete Customer?
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{customer.name_english}</span>? This
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

export default Customers;
