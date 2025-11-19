// src/components/hallBooking/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  AlertCircle,
} from "lucide-react";

const CustomerForm = ({ customer, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    customer_type: "external",
    name_english: "",
    name_chinese: "",
    ic_number: "",
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    state: "",
    country: "Malaysia",
    company_name: "",
    remarks: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_type: customer.customer_type || "external",
        name_english: customer.name_english || "",
        name_chinese: customer.name_chinese || "",
        ic_number: customer.ic_number || "",
        contact_person: customer.contact_person || "",
        contact_number: customer.contact_number || "",
        email: customer.email || "",
        address: customer.address || "",
        postcode: customer.postcode || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "Malaysia",
        company_name: customer.company_name || "",
        remarks: customer.remarks || "",
        is_active: customer.is_active !== undefined ? customer.is_active : true,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer_type)
      newErrors.customer_type = "Customer type is required";
    if (!formData.name_english.trim())
      newErrors.name_english = "Name is required";
    if (!formData.contact_person.trim())
      newErrors.contact_person = "Contact person is required";
    if (!formData.contact_number.trim())
      newErrors.contact_number = "Contact number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const malaysianStates = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Malacca",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Perlis",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
    "Wilayah Persekutuan",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD54F] to-[#FFB200] rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide border-l-4 border-[#FFD54F] pl-3">
                {customer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                {customer
                  ? "Update customer information"
                  : "Fill in the customer details below"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="relative p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 bg-[#FFF8F6]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Type */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <select
                name="customer_type"
                value={formData.customer_type}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50 ${
                  errors.customer_type
                    ? "border-red-500"
                    : "border-[#FFD54F]/50"
                }`}
              >
                <option value="internal">Internal (Member)</option>
                <option value="external">External (Non-Member)</option>
              </select>
              {errors.customer_type && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                  {errors.customer_type}
                </p>
              )}
            </div>

            {/* Name English */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name_english"
                value={formData.name_english}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50 ${
                  errors.name_english ? "border-red-500" : "border-[#FFD54F]/50"
                }`}
                placeholder="John Tan"
              />
              {errors.name_english && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                  {errors.name_english}
                </p>
              )}
            </div>

            {/* Name Chinese */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Name (Chinese)
              </label>
              <input
                type="text"
                name="name_chinese"
                value={formData.name_chinese}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="陈大明"
              />
            </div>

            {/* IC Number */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                IC Number
              </label>
              <input
                type="text"
                name="ic_number"
                value={formData.ic_number}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="880101-01-1234"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50 ${
                  errors.contact_person
                    ? "border-red-500"
                    : "border-[#FFD54F]/50"
                }`}
                placeholder="Contact person name"
              />
              {errors.contact_person && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                  {errors.contact_person}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A60000]"
                  strokeWidth={2.5}
                />
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50 ${
                    errors.contact_number
                      ? "border-red-500"
                      : "border-[#FFD54F]/50"
                  }`}
                  placeholder="0123456789"
                />
              </div>
              {errors.contact_number && (
                <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                  {errors.contact_number}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A60000]"
                  strokeWidth={2.5}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Company Name
              </label>
              <div className="relative">
                <Building2
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A60000]"
                  strokeWidth={2.5}
                />
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                  placeholder="Company name (optional)"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows="2"
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="123 Main Street"
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Postcode
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="50000"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                City
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A60000]"
                  strokeWidth={2.5}
                />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                  placeholder="Kuala Lumpur"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
              >
                <option value="">Select State</option>
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="Malaysia"
              />
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                disabled={loading}
                rows="3"
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium transition-all disabled:opacity-50"
                placeholder="Additional notes..."
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-r from-[#FFD54F]/10 to-[#FFB200]/10 border-2 border-[#FFD54F]/30 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 text-[#A60000] border-gray-300 rounded focus:ring-2 focus:ring-[#FFD54F] disabled:opacity-50"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Active Status (Check if customer is currently active)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-[#FFF8F6] border-t-2 border-[#FFD54F]/30 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 tracking-wide border-2 border-white"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" strokeWidth={2.5} />
                <span>{customer ? "Update" : "Save"} Customer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
