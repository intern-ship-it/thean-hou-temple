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
  RefreshCw,
  Users,
  Eye,
  X,
  Trash2,
  UserCheck,
  Building2,
  AlertCircle,
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
              <Users className="w-8 h-8 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Customers Management
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Manage hall booking customers
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FFB200] text-[#800000] font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FFD54F]/50 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
              <span className="tracking-wide">Add Customer</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 hover:bg-white/20 transition-all transform hover:-translate-y-1 hover:shadow-lg border border-[#FFD54F]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                    Internal
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {statistics.internal}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#FFD54F] rounded-xl flex items-center justify-center">
                  <UserCheck
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
                    External
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {statistics.external}
                  </p>
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
                  <UserCheck
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
                    With Bookings
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {statistics.with_bookings}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#FFD54F] rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-[#800000]" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        )}
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
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-[#FFF8F6] font-medium"
              />
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCustomerTypeFilter("")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.customer_type === ""
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleCustomerTypeFilter("internal")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.customer_type === "internal"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => handleCustomerTypeFilter("external")}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                filters.customer_type === "external"
                  ? "bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white shadow-lg"
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
              customers
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center space-x-3">
            <Eye className="w-6 h-6 text-white" strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-white tracking-wide border-l-4 border-[#FFD54F] pl-3">
              Customer Details
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border-4 border-red-300">
        <div className="p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Trash2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3 tracking-wide">
            Delete Customer?
          </h2>
          <p className="text-gray-600 text-center mb-6 font-medium">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#A60000]">
              {customer.name_english}
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

// Info Field Component
const InfoField = ({ label, value, className = "" }) => (
  <div>
    <label className="block text-sm font-bold text-gray-600 mb-1 tracking-wide">
      {label}
    </label>
    <p className={`text-gray-900 font-semibold ${className}`}>{value}</p>
  </div>
);

export default Customers;
