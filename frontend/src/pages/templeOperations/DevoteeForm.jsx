// src/components/templeOperations/DevoteeForm.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

const DevoteeForm = ({ devotee, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name_english: "",
    name_chinese: "",
    ic_number: "",
    phone: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    state: "",
    country: "Malaysia",
    date_of_birth: "",
    gender: "male",
    notes: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (devotee) {
      setFormData({
        name_english: devotee.name_english || "",
        name_chinese: devotee.name_chinese || "",
        ic_number: devotee.ic_number || "",
        phone: devotee.phone || "",
        email: devotee.email || "",
        address: devotee.address || "",
        postcode: devotee.postcode || "",
        city: devotee.city || "",
        state: devotee.state || "",
        country: devotee.country || "Malaysia",
        date_of_birth: devotee.date_of_birth || "",
        gender: devotee.gender || "male",
        notes: devotee.notes || "",
        is_active: devotee.is_active !== undefined ? devotee.is_active : true,
      });
    }
  }, [devotee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name_english.trim())
      newErrors.name_english = "English name is required";
    if (!formData.ic_number.trim())
      newErrors.ic_number = "IC number is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {devotee ? "Edit Devotee" : "Add New Devotee"}
              </h2>
              <p className="text-sm text-primary-100">
                {devotee
                  ? "Update devotee information"
                  : "Fill in the devotee details below"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-180px)] p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name English */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name_english"
                value={formData.name_english}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.name_english ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="John Tan"
              />
              {errors.name_english && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name_english}
                </p>
              )}
            </div>

            {/* Name Chinese */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name (Chinese)
              </label>
              <input
                type="text"
                name="name_chinese"
                value={formData.name_chinese}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="陈大明"
              />
            </div>

            {/* IC Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IC Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ic_number"
                value={formData.ic_number}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 ${
                  errors.ic_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="880101-01-1234"
              />
              {errors.ic_number && (
                <p className="mt-1 text-sm text-red-600">{errors.ic_number}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0123456789"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                rows="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="123 Main Street"
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Postcode
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="50000"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Kuala Lumpur"
                />
              </div>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {malaysianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Malaysia"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={loading}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50"
                placeholder="Additional notes..."
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active Status (Check if devotee is currently active)
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary-800 text-white font-medium rounded-lg hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{devotee ? "Update" : "Save"} Devotee</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevoteeForm;
