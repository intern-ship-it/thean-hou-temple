// src/components/hallBooking/HallForm.jsx
import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Building2, AlertCircle } from "lucide-react";

const HallForm = ({ hall, onSubmit, onClose, loading }) => {
  const [formData, setFormData] = useState({
    hall_name: "",
    hall_code: "",
    capacity: "",
    location: "",
    description: "",
    internal_price: "",
    external_price: "",
    facilities: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (hall) {
      setFormData({
        hall_name: hall.hall_name || "",
        hall_code: hall.hall_code || "",
        capacity: hall.capacity || "",
        location: hall.location || "",
        description: hall.description || "",
        internal_price: hall.internal_price || "",
        external_price: hall.external_price || "",
        facilities: hall.facilities || "",
        is_active: hall.is_active !== undefined ? hall.is_active : true,
      });
    }
  }, [hall]);

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

    if (!formData.hall_name.trim())
      newErrors.hall_name = "Hall name is required";
    if (!formData.hall_code.trim())
      newErrors.hall_code = "Hall code is required";
    if (!formData.capacity || formData.capacity < 1)
      newErrors.capacity = "Valid capacity is required";
    if (!formData.internal_price || formData.internal_price < 0)
      newErrors.internal_price = "Internal price is required";
    if (!formData.external_price || formData.external_price < 0)
      newErrors.external_price = "External price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border-4 border-[#FFD54F]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A60000] via-[#800000] to-[#FFB200] px-6 py-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD54F] opacity-20 rounded-full blur-2xl"></div>
          <div className="relative flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD54F] to-[#FFB200] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-[#800000]" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide border-l-4 border-[#FFD54F] pl-3">
                {hall ? "Edit Hall" : "Add New Hall"}
              </h2>
              <p className="text-[#FFD54F] text-sm font-medium tracking-wide">
                Configure hall details and pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="relative p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-[#FFF8F6]"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hall Name */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Hall Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hall_name"
                    value={formData.hall_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium ${
                      errors.hall_name
                        ? "border-red-500"
                        : "border-[#FFD54F]/50"
                    }`}
                    placeholder="e.g., Grand Hall A"
                  />
                  {errors.hall_name && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      {errors.hall_name}
                    </p>
                  )}
                </div>

                {/* Hall Code */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Hall Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hall_code"
                    value={formData.hall_code}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium ${
                      errors.hall_code
                        ? "border-red-500"
                        : "border-[#FFD54F]/50"
                    }`}
                    placeholder="e.g., HALL-A"
                  />
                  {errors.hall_code && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      {errors.hall_code}
                    </p>
                  )}
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Capacity (people) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    disabled={loading}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium ${
                      errors.capacity ? "border-red-500" : "border-[#FFD54F]/50"
                    }`}
                    placeholder="500"
                  />
                  {errors.capacity && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      {errors.capacity}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium"
                    placeholder="e.g., Ground Floor, West Wing"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t-2 border-[#FFD54F]/30 pt-6">
              <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Internal Price */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Internal Price (Members){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A60000] font-bold">
                      RM
                    </span>
                    <input
                      type="number"
                      name="internal_price"
                      value={formData.internal_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium ${
                        errors.internal_price
                          ? "border-red-500"
                          : "border-[#FFD54F]/50"
                      }`}
                      placeholder="1500.00"
                    />
                  </div>
                  {errors.internal_price && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      {errors.internal_price}
                    </p>
                  )}
                </div>

                {/* External Price */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    External Price (Non-Members){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A60000] font-bold">
                      RM
                    </span>
                    <input
                      type="number"
                      name="external_price"
                      value={formData.external_price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium ${
                        errors.external_price
                          ? "border-red-500"
                          : "border-[#FFD54F]/50"
                      }`}
                      placeholder="2000.00"
                    />
                  </div>
                  {errors.external_price && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      {errors.external_price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t-2 border-[#FFD54F]/30 pt-6">
              <h3 className="text-lg font-bold text-[#800000] mb-5 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Additional Details
              </h3>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium"
                  placeholder="Brief description of the hall..."
                />
              </div>

              {/* Facilities */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Facilities
                </label>
                <textarea
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleChange}
                  disabled={loading}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] focus:border-[#FFD54F] bg-white font-medium"
                  placeholder="e.g., Air conditioning, Stage, Sound system, Projector, WiFi..."
                />
              </div>

              {/* Active Status */}
              <div className="bg-gradient-to-r from-[#FFD54F]/10 to-[#FFB200]/10 border-2 border-[#FFD54F]/30 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-5 h-5 text-[#A60000] border-gray-300 rounded focus:ring-2 focus:ring-[#FFD54F]"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Hall is Active (Available for booking)
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
            className="px-6 py-3 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all disabled:opacity-50 tracking-wide"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all disabled:from-gray-300 disabled:to-gray-400 flex items-center space-x-2 tracking-wide border-2 border-white"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" strokeWidth={2.5} />
                <span>{hall ? "Update" : "Save"} Hall</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallForm;
