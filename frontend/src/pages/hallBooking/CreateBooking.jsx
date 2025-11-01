// src/pages/hallBooking/CreateBooking.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createBooking,
  clearCurrentBooking,
} from "../../features/hallBooking/bookingsSlice";
import { fetchCustomers } from "../../features/hallBooking/customersSlice";
import {
  fetchHalls,
  checkAvailability,
} from "../../features/hallBooking/hallsSlice";
import { fetchBillingItems } from "../../features/hallBooking/billingItemsSlice";
import { fetchDinnerPackages } from "../../features/hallBooking/dinnerPackagesSlice";
import { fetchCateringVendors } from "../../features/hallBooking/cateringVendorsSlice";
import {
  ArrowLeft,
  Save,
  Loader2,
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Building2,
} from "lucide-react";

const CreateBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get pre-filled data from calendar selection
  const prefilledData = location.state?.prefilledData || {};

  const { loading } = useSelector((state) => state.bookings);
  const { customers } = useSelector((state) => state.customers);
  const { halls, availability } = useSelector((state) => state.halls);
  const { items: billingItems } = useSelector((state) => state.billingItems);
  const { packages: dinnerPackages } = useSelector(
    (state) => state.dinnerPackages
  );
  const { vendors: cateringVendors } = useSelector(
    (state) => state.cateringVendors
  );

  const [formData, setFormData] = useState({
    customer_id: "",
    hall_id: prefilledData.hall_id || "",
    booking_type: "standard",
    event_date: prefilledData.event_date || "",
    time_slot: prefilledData.time_slot || "morning",
    start_time: "09:00",
    end_time: "14:00",
    event_type: "",
    guest_count: "",
    status: "pending",
    special_requests: "",
    internal_notes: "",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [dinnerPackageData, setDinnerPackageData] = useState({
    dinner_package_id: "",
    catering_vendor_id: "",
    number_of_tables: 50,
    special_menu_requests: "",
  });

  const [errors, setErrors] = useState({});
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Load data on mount
  useEffect(() => {
    dispatch(clearCurrentBooking());
    dispatch(fetchCustomers({ page: 1, per_page: 1000 }));
    dispatch(fetchHalls({ page: 1, per_page: 100 }));
    dispatch(fetchBillingItems({ page: 1, per_page: 1000 }));
    dispatch(fetchDinnerPackages({ page: 1, per_page: 100 }));
    dispatch(fetchCateringVendors({ page: 1, per_page: 100 }));
  }, [dispatch]);

  // Update end time based on time slot
  useEffect(() => {
    if (formData.time_slot === "morning") {
      setFormData((prev) => ({
        ...prev,
        start_time: "09:00",
        end_time: "14:00",
      }));
    } else if (formData.time_slot === "evening") {
      setFormData((prev) => ({
        ...prev,
        start_time: "18:00",
        end_time: "23:00",
      }));
    }
  }, [formData.time_slot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear availability check when relevant fields change
    if (["hall_id", "event_date", "time_slot"].includes(name)) {
      setAvailabilityChecked(false);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.hall_id || !formData.event_date || !formData.time_slot) {
      setErrors({
        hall_id: !formData.hall_id ? "Hall is required" : "",
        event_date: !formData.event_date ? "Event date is required" : "",
        time_slot: !formData.time_slot ? "Time slot is required" : "",
      });
      return;
    }

    setCheckingAvailability(true);
    try {
      await dispatch(
        checkAvailability({
          hall_id: formData.hall_id,
          event_date: formData.event_date, // ✅ CORRECT
          time_slot: formData.time_slot,
        })
      ).unwrap();
      setAvailabilityChecked(true);
    } catch (error) {
      setErrors({
        availability: error.message || "Failed to check availability",
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItems([
      ...selectedItems,
      {
        billing_item_id: "",
        quantity: 1,
        unit_price: 0,
        remarks: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Auto-populate unit price when billing item is selected
    if (field === "billing_item_id") {
      const item = billingItems.find((bi) => bi.id === parseInt(value));
      if (item) {
        // Use external price by default (you can modify this logic based on customer type)
        newItems[index].unit_price = item.price_external || 0;
      }
    }

    setSelectedItems(newItems);
  };

  const handleDinnerPackageChange = (e) => {
    const { name, value } = e.target;
    setDinnerPackageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_id) newErrors.customer_id = "Customer is required";
    if (!formData.hall_id) newErrors.hall_id = "Hall is required";
    if (!formData.event_date) newErrors.event_date = "Event date is required";
    if (!formData.time_slot) newErrors.time_slot = "Time slot is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.event_type) newErrors.event_type = "Event type is required";
    if (!formData.guest_count)
      newErrors.guest_count = "Guest count is required";

    if (!availabilityChecked) {
      newErrors.availability = "Please check hall availability first";
    }

    if (formData.booking_type === "with_dinner") {
      if (!dinnerPackageData.dinner_package_id) {
        newErrors.dinner_package = "Dinner package is required";
      }
      if (!dinnerPackageData.catering_vendor_id) {
        newErrors.catering_vendor = "Catering vendor is required";
      }
      if (
        !dinnerPackageData.number_of_tables ||
        dinnerPackageData.number_of_tables < 50
      ) {
        newErrors.number_of_tables =
          "Minimum 50 tables required for dinner package";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    // Calculate items total
    const itemsTotal = selectedItems.reduce((sum, item) => {
      return (
        sum + parseFloat(item.unit_price || 0) * parseInt(item.quantity || 0)
      );
    }, 0);

    // Add dinner package if applicable
    let dinnerTotal = 0;
    if (
      formData.booking_type === "with_dinner" &&
      dinnerPackageData.dinner_package_id
    ) {
      const selectedPackage = dinnerPackages.find(
        (pkg) => pkg.id === parseInt(dinnerPackageData.dinner_package_id)
      );
      if (selectedPackage) {
        dinnerTotal =
          parseFloat(selectedPackage.price_per_table) *
          parseInt(dinnerPackageData.number_of_tables || 0);
      }
    }

    // Add hall base price
    const selectedHall = halls.find((h) => h.id === parseInt(formData.hall_id));
    const hallPrice = selectedHall
      ? parseFloat(selectedHall.base_price_external || 0)
      : 0;

    return (hallPrice + itemsTotal + dinnerTotal).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      booking_items: selectedItems.filter((item) => item.billing_item_id),
    };

    if (formData.booking_type === "with_dinner") {
      submitData.dinner_package = dinnerPackageData;
    }

    try {
      await dispatch(createBooking(submitData)).unwrap();
      navigate("/hall/bookings");
    } catch (err) {
      console.error("Failed to create booking:", err);
      setErrors({ submit: err.message || "Failed to create booking" });
    }
  };

  const handleCancel = () => {
    navigate("/hall/bookings");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Create New Booking
              </h1>
              <p className="text-purple-100">
                Fill in the booking details below
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-purple-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.customer_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_code} - {customer.full_name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.customer_id}
                  </p>
                )}
              </div>

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Booking Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="booking_type"
                  value={formData.booking_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="standard">Standard Hall Rental</option>
                  <option value="with_dinner">With Dinner Package</option>
                </select>
              </div>

              {/* Hall */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hall <span className="text-red-500">*</span>
                </label>
                <select
                  name="hall_id"
                  value={formData.hall_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.hall_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Hall</option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.hall_name} (RM {hall.base_price_external})
                    </option>
                  ))}
                </select>
                {errors.hall_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.hall_id}</p>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.event_date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.event_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.event_date}
                  </p>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="morning">Morning (9:00 AM - 2:00 PM)</option>
                  <option value="evening">Evening (6:00 PM - 11:00 PM)</option>
                </select>
              </div>

              {/* Check Availability Button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={
                    !formData.hall_id ||
                    !formData.event_date ||
                    !formData.time_slot ||
                    checkingAvailability
                  }
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {checkingAvailability ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Check Availability</span>
                    </>
                  )}
                </button>

                {/* Availability Status */}
                {availabilityChecked && availability?.available && (
                  <div className="mt-3 flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Hall is available!</span>
                  </div>
                )}

                {availability?.available === false && (
                  <div className="mt-3 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {availability.message}
                    </span>
                  </div>
                )}

                {errors.availability && (
                  <p className="mt-3 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.availability}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Birthday"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.event_type ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.event_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.event_type}
                  </p>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleChange}
                  min="1"
                  placeholder="Expected guests"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.guest_count ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.guest_count && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.guest_count}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-purple-600" />
                Additional Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Billing Item */}
                    <div className="md:col-span-4">
                      <select
                        value={item.billing_item_id}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "billing_item_id",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Item</option>
                        {billingItems.map((bi) => (
                          <option key={bi.id} value={bi.id}>
                            {bi.item_name} - RM {bi.price_external}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        min="1"
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          handleItemChange(index, "unit_price", e.target.value)
                        }
                        step="0.01"
                        placeholder="Price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) =>
                          handleItemChange(index, "remarks", e.target.value)
                        }
                        placeholder="Remarks (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dinner Package (if applicable) */}
          {formData.booking_type === "with_dinner" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Dinner Package Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dinner Package */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dinner Package <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="dinner_package_id"
                    value={dinnerPackageData.dinner_package_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.dinner_package
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Package</option>
                    {dinnerPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.package_code} - {pkg.package_name} (RM{" "}
                        {pkg.price_per_table}/table)
                      </option>
                    ))}
                  </select>
                  {errors.dinner_package && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dinner_package}
                    </p>
                  )}
                </div>

                {/* Catering Vendor */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catering Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="catering_vendor_id"
                    value={dinnerPackageData.catering_vendor_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.catering_vendor
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Vendor</option>
                    {cateringVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name} ({vendor.cuisine_type})
                      </option>
                    ))}
                  </select>
                  {errors.catering_vendor && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.catering_vendor}
                    </p>
                  )}
                </div>

                {/* Number of Tables */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Tables <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="number_of_tables"
                    value={dinnerPackageData.number_of_tables}
                    onChange={handleDinnerPackageChange}
                    min="50"
                    placeholder="Minimum 50 tables"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                      errors.number_of_tables
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.number_of_tables && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.number_of_tables}
                    </p>
                  )}
                </div>

                {/* Special Menu Requests */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Menu Requests
                  </label>
                  <textarea
                    name="special_menu_requests"
                    value={dinnerPackageData.special_menu_requests}
                    onChange={handleDinnerPackageChange}
                    rows="3"
                    placeholder="Any special dietary requirements or menu preferences..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Special Requests & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Special Requests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests from customer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Internal Notes
              </label>
              <textarea
                name="internal_notes"
                value={formData.internal_notes}
                onChange={handleChange}
                rows="4"
                placeholder="Internal notes (not visible to customer)..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Total */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Estimated Total:
              </span>
              <span className="text-3xl font-bold text-purple-600">
                RM {calculateTotal()}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availabilityChecked}
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Create Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;
