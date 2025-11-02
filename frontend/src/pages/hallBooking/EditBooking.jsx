// src/pages/hallBooking/EditBooking.jsx
// FIXED FOR YOUR EXACT API STRUCTURE
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateBooking,
  fetchBookingById,
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

const EditBooking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, currentBooking } = useSelector((state) => state.bookings);
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
    hall_id: "",
    booking_type: "standard",
    event_date: "",
    time_slot: "morning",
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
    package_id: "", // CHANGED: package.id from your API
    vendor_id: "", // CHANGED: vendor.id from your API
    number_of_tables: 50,
    special_menu_requests: "",
  });

  const [errors, setErrors] = useState({});
  const [availabilityChecked, setAvailabilityChecked] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allDataReady, setAllDataReady] = useState(false);

  // Load all required data on mount
  useEffect(() => {
    dispatch(fetchBookingById(id));
    dispatch(fetchCustomers({ page: 1, per_page: 1000 }));
    dispatch(fetchHalls({ page: 1, per_page: 100 }));
    dispatch(fetchBillingItems({ page: 1, per_page: 1000 }));
    dispatch(fetchDinnerPackages({ page: 1, per_page: 100 }));
    dispatch(fetchCateringVendors({ page: 1, per_page: 100 }));

    return () => {
      dispatch(clearCurrentBooking());
    };
  }, [dispatch, id]);

  // Check if all required data is loaded
  useEffect(() => {
    if (
      currentBooking &&
      customers.length > 0 &&
      halls.length > 0 &&
      billingItems.length > 0 &&
      dinnerPackages.length > 0 &&
      cateringVendors.length > 0
    ) {
      setAllDataReady(true);
    }
  }, [
    currentBooking,
    customers,
    halls,
    billingItems,
    dinnerPackages,
    cateringVendors,
  ]);

  // Populate form with existing booking data - FIXED FOR YOUR API STRUCTURE
  useEffect(() => {
    if (allDataReady && !dataLoaded) {
      console.log("Loading booking data:", currentBooking);

      // Convert event_date from "2025-11-30T00:00:00.000000Z" to "2025-11-30"
      const eventDate = currentBooking.event_date
        ? currentBooking.event_date.split("T")[0]
        : "";

      setFormData({
        customer_id: currentBooking.customer_id || "",
        hall_id: currentBooking.hall_id || "",
        booking_type: currentBooking.booking_type || "standard",
        event_date: eventDate,
        time_slot: currentBooking.time_slot || "morning",
        start_time: currentBooking.start_time || "09:00",
        end_time: currentBooking.end_time || "14:00",
        event_type: currentBooking.event_type || "",
        guest_count: currentBooking.guest_count || "",
        status: currentBooking.status || "pending",
        special_requests: currentBooking.special_requests || "",
        internal_notes: currentBooking.internal_notes || "",
      });

      // Set booking items - FIXED to match your structure
      if (
        currentBooking.booking_items &&
        currentBooking.booking_items.length > 0
      ) {
        setSelectedItems(
          currentBooking.booking_items.map((item) => ({
            id: item.id,
            billing_item_id: item.billing_item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            remarks: item.remarks || "",
          }))
        );
      }

      // Set dinner package data - FIXED FOR YOUR API STRUCTURE
      if (
        currentBooking.booking_type === "with_dinner" &&
        currentBooking.dinner_package
      ) {
        console.log(
          "Loading dinner package data:",
          currentBooking.dinner_package
        );

        // YOUR API STRUCTURE:
        // dinner_package.package.id (not dinner_package_id)
        // dinner_package.vendor.id (not catering_vendor_id)
        setDinnerPackageData({
          package_id: currentBooking.dinner_package.package?.id || "",
          vendor_id: currentBooking.dinner_package.vendor?.id || "",
          number_of_tables:
            currentBooking.dinner_package.number_of_tables || 50,
          special_menu_requests:
            currentBooking.dinner_package.special_menu_requests || "",
        });

        console.log("Set dinner package data:", {
          package_id: currentBooking.dinner_package.package?.id,
          vendor_id: currentBooking.dinner_package.vendor?.id,
          number_of_tables: currentBooking.dinner_package.number_of_tables,
        });
      }

      setDataLoaded(true);
    }
  }, [allDataReady, currentBooking, dataLoaded]);

  // Update end time based on time slot
  useEffect(() => {
    if (!dataLoaded) return;

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
  }, [formData.time_slot, dataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (["hall_id", "event_date", "time_slot"].includes(name)) {
      setAvailabilityChecked(false);
    }

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
          date: formData.event_date,
          time_slot: formData.time_slot,
          exclude_booking_id: id,
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

    if (field === "billing_item_id") {
      const item = billingItems.find((bi) => bi.id === parseInt(value));
      if (item) {
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
      if (!dinnerPackageData.package_id) {
        newErrors.dinner_package = "Dinner package is required";
      }
      if (!dinnerPackageData.vendor_id) {
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

  // FIXED: Calculate total including dinner package - MATCHES YOUR API STRUCTURE
  const calculateTotal = () => {
    // Calculate items total
    const itemsTotal = selectedItems.reduce((sum, item) => {
      return (
        sum + parseFloat(item.unit_price || 0) * parseInt(item.quantity || 0)
      );
    }, 0);

    // Add hall base price (if your hall has rental_rate_external)
    const selectedHall = halls.find((h) => h.id === parseInt(formData.hall_id));
    const hallPrice = selectedHall
      ? parseFloat(selectedHall.rental_rate_external || 0)
      : 0;

    // Add dinner package if applicable - FIXED FOR YOUR API
    let dinnerTotal = 0;
    if (
      formData.booking_type === "with_dinner" &&
      dinnerPackageData.package_id
    ) {
      const selectedPackage = dinnerPackages.find(
        (pkg) => pkg.id === parseInt(dinnerPackageData.package_id)
      );
      if (selectedPackage) {
        // YOUR API: price_per_table is in the package object
        dinnerTotal =
          parseFloat(selectedPackage.price_per_table || 0) *
          parseInt(dinnerPackageData.number_of_tables || 0);
      }
    }

    const total = hallPrice + itemsTotal + dinnerTotal;

    console.log("💰 Total Calculation:", {
      hallPrice,
      itemsTotal,
      dinnerTotal,
      total,
      booking_type: formData.booking_type,
      package_id: dinnerPackageData.package_id,
      number_of_tables: dinnerPackageData.number_of_tables,
      selectedPackage: dinnerPackages.find(
        (pkg) => pkg.id === parseInt(dinnerPackageData.package_id)
      ),
    });

    return total.toFixed(2);
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

    // FIXED: Submit with your API structure
    if (formData.booking_type === "with_dinner") {
      submitData.dinner_package = {
        package_id: dinnerPackageData.package_id, // Your API uses package_id
        vendor_id: dinnerPackageData.vendor_id, // Your API uses vendor_id
        number_of_tables: dinnerPackageData.number_of_tables,
        special_menu_requests: dinnerPackageData.special_menu_requests,
      };
    }

    console.log("📤 Submitting booking:", submitData);

    try {
      await dispatch(updateBooking({ id, data: submitData })).unwrap();
      navigate("/hall/bookings");
    } catch (err) {
      console.error("Failed to update booking:", err);
      setErrors({ submit: err.message || "Failed to update booking" });
    }
  };

  const handleCancel = () => {
    navigate("/hall/bookings");
  };

  if (!allDataReady || !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A60000] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-inter">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIwIiBmaWxsPSIjQTYwMDAwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] -z-10"></div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#A60000] via-[#800000] to-[#FFB200] rounded-2xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD54F] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB200] opacity-10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-3 hover:bg-white/20 rounded-xl transition-all border-2 border-[#FFD54F]/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-wide border-l-4 border-[#FFD54F] pl-3">
                Edit Booking
              </h1>
              <p className="text-[#FFD54F] font-medium tracking-wide">
                Update booking details for {currentBooking?.booking_code}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#FFD54F]/30">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-[#800000] mb-6 flex items-center tracking-wide border-l-4 border-[#FFD54F] pl-3">
              <Building2
                className="w-6 h-6 mr-3 text-[#FFD54F]"
                strokeWidth={2.5}
              />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                    errors.customer_id
                      ? "border-red-500"
                      : "border-[#FFD54F]/50"
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.customer_code} -{" "}
                      {customer.name_english || customer.full_name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.customer_id}
                  </p>
                )}
              </div>

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Booking Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="booking_type"
                  value={formData.booking_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                >
                  <option value="standard">Standard Hall Rental</option>
                  <option value="with_dinner">With Dinner Package</option>
                </select>
              </div>

              {/* Hall */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Hall <span className="text-red-500">*</span>
                </label>
                <select
                  name="hall_id"
                  value={formData.hall_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                    errors.hall_id ? "border-red-500" : "border-[#FFD54F]/50"
                  }`}
                >
                  <option value="">Select Hall</option>
                  {halls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.hall_name}{" "}
                      {hall.rental_rate_external &&
                        `(RM ${hall.rental_rate_external})`}
                    </option>
                  ))}
                </select>
                {errors.hall_id && (
                  <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.hall_id}
                  </p>
                )}
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                    errors.event_date ? "border-red-500" : "border-[#FFD54F]/50"
                  }`}
                />
                {errors.event_date && (
                  <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.event_date}
                  </p>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  name="time_slot"
                  value={formData.time_slot}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                >
                  <option value="morning">Morning (9:00 AM - 2:00 PM)</option>
                  <option value="evening">Evening (6:00 PM - 11:00 PM)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Booking Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FFB200] to-[#FFD54F] text-[#800000] font-bold rounded-xl hover:shadow-xl hover:shadow-[#FFD54F]/50 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 tracking-wide border-2 border-white"
                >
                  {checkingAvailability ? (
                    <>
                      <Loader2
                        className="w-6 h-6 animate-spin"
                        strokeWidth={2.5}
                      />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                      <span>Check Availability</span>
                    </>
                  )}
                </button>

                {availabilityChecked && availability?.available && (
                  <div className="mt-4 flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-xl border-2 border-green-300">
                    <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                    <span className="font-bold tracking-wide">
                      Hall is available!
                    </span>
                  </div>
                )}

                {availability?.available === false && (
                  <div className="mt-4 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border-2 border-red-300">
                    <AlertCircle className="w-6 h-6" strokeWidth={2.5} />
                    <span className="font-bold tracking-wide">
                      {availability.message}
                    </span>
                  </div>
                )}

                {errors.availability && (
                  <p className="mt-4 text-sm text-red-600 flex items-center bg-red-50 p-4 rounded-xl border-2 border-red-300 font-semibold">
                    <AlertCircle className="w-5 h-5 mr-2" strokeWidth={2.5} />
                    {errors.availability}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-xl font-bold text-[#800000] mb-6 flex items-center tracking-wide border-l-4 border-[#FFD54F] pl-3">
              <Calendar
                className="w-6 h-6 mr-3 text-[#FFD54F]"
                strokeWidth={2.5}
              />
              Event Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Birthday"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                    errors.event_type ? "border-red-500" : "border-[#FFD54F]/50"
                  }`}
                />
                {errors.event_type && (
                  <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.event_type}
                  </p>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Expected Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="guest_count"
                  value={formData.guest_count}
                  onChange={handleChange}
                  min="1"
                  placeholder="Expected guests"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                    errors.guest_count
                      ? "border-red-500"
                      : "border-[#FFD54F]/50"
                  }`}
                />
                {errors.guest_count && (
                  <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.guest_count}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Additional Items */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#800000] flex items-center tracking-wide border-l-4 border-[#FFD54F] pl-3">
                <Plus
                  className="w-6 h-6 mr-3 text-[#FFD54F]"
                  strokeWidth={2.5}
                />
                Additional Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-6 py-3 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white rounded-xl hover:shadow-lg hover:shadow-[#A60000]/30 transition-all flex items-center space-x-2 font-bold tracking-wide"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                <span>Add Item</span>
              </button>
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-4">
                {selectedItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-gradient-to-r from-[#FFF8F6] to-white rounded-2xl border-2 border-[#FFD54F]/30 shadow-md"
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
                        className="w-full px-3 py-2.5 border-2 border-[#FFD54F]/50 rounded-xl bg-white font-medium"
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
                        className="w-full px-3 py-2.5 border-2 border-[#FFD54F]/50 rounded-xl bg-white font-medium"
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
                        className="w-full px-3 py-2.5 border-2 border-[#FFD54F]/50 rounded-xl bg-white font-medium"
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
                        className="w-full px-3 py-2.5 border-2 border-[#FFD54F]/50 rounded-xl bg-white font-medium"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="md:col-span-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border-2 border-red-300"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dinner Package - FIXED FOR YOUR API */}
          {formData.booking_type === "with_dinner" && (
            <div>
              <h3 className="text-xl font-bold text-[#800000] mb-6 flex items-center tracking-wide border-l-4 border-[#FFD54F] pl-3">
                <Users
                  className="w-6 h-6 mr-3 text-[#FFD54F]"
                  strokeWidth={2.5}
                />
                Dinner Package Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dinner Package - CHANGED: using package_id */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Dinner Package <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="package_id"
                    value={dinnerPackageData.package_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                      errors.dinner_package
                        ? "border-red-500"
                        : "border-[#FFD54F]/50"
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
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.dinner_package}
                    </p>
                  )}
                </div>

                {/* Catering Vendor - CHANGED: using vendor_id */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Catering Vendor <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vendor_id"
                    value={dinnerPackageData.vendor_id}
                    onChange={handleDinnerPackageChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                      errors.catering_vendor
                        ? "border-red-500"
                        : "border-[#FFD54F]/50"
                    }`}
                  >
                    <option value="">Select Vendor</option>
                    {cateringVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.vendor_name} ({vendor.vendor_type})
                      </option>
                    ))}
                  </select>
                  {errors.catering_vendor && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.catering_vendor}
                    </p>
                  )}
                </div>

                {/* Number of Tables */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Number of Tables <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="number_of_tables"
                    value={dinnerPackageData.number_of_tables}
                    onChange={handleDinnerPackageChange}
                    min="50"
                    placeholder="Minimum 50 tables"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium ${
                      errors.number_of_tables
                        ? "border-red-500"
                        : "border-[#FFD54F]/50"
                    }`}
                  />
                  {errors.number_of_tables && (
                    <p className="mt-2 text-sm text-red-600 font-semibold flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.number_of_tables}
                    </p>
                  )}
                </div>

                {/* Special Menu Requests */}
                <div>
                  <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                    Special Menu Requests
                  </label>
                  <textarea
                    name="special_menu_requests"
                    value={dinnerPackageData.special_menu_requests}
                    onChange={handleDinnerPackageChange}
                    rows="3"
                    placeholder="Any special dietary requirements or menu preferences..."
                    className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Special Requests & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Special Requests
              </label>
              <textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                rows="4"
                placeholder="Any special requests from customer..."
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#800000] mb-2 tracking-wide">
                Internal Notes
              </label>
              <textarea
                name="internal_notes"
                value={formData.internal_notes}
                onChange={handleChange}
                rows="4"
                placeholder="Internal notes (not visible to customer)..."
                className="w-full px-4 py-3 border-2 border-[#FFD54F]/50 rounded-xl focus:ring-2 focus:ring-[#FFD54F] bg-[#FFF8F6] font-medium"
              />
            </div>
          </div>

          {/* Total with Breakdown */}
          <div className="bg-gradient-to-br from-[#FFD54F]/30 to-[#FFB200]/30 border-4 border-[#FFD54F] rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-[#800000] tracking-wide">
                Estimated Total:
              </span>
              <span className="text-4xl font-bold text-[#A60000] tracking-wide">
                RM {calculateTotal()}
              </span>
            </div>

            {/* Show breakdown */}
            {formData.booking_type === "with_dinner" &&
              dinnerPackageData.package_id && (
                <div className="pt-4 border-t-2 border-[#FFD54F] space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Hall Base Price:</span>
                    <span className="font-semibold">
                      RM{" "}
                      {halls.find((h) => h.id === parseInt(formData.hall_id))
                        ?.rental_rate_external || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Additional Items:</span>
                    <span className="font-semibold">
                      RM{" "}
                      {selectedItems
                        .reduce(
                          (sum, item) =>
                            sum +
                            parseFloat(item.unit_price || 0) *
                              parseInt(item.quantity || 0),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A60000] font-bold text-base">
                    <span>
                      Dinner Package ({dinnerPackageData.number_of_tables}{" "}
                      tables):
                    </span>
                    <span>
                      RM{" "}
                      {(
                        parseFloat(
                          dinnerPackages.find(
                            (pkg) =>
                              pkg.id === parseInt(dinnerPackageData.package_id)
                          )?.price_per_table || 0
                        ) * parseInt(dinnerPackageData.number_of_tables || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border-4 border-red-300 rounded-2xl p-6 flex items-start space-x-3 shadow-lg">
              <AlertCircle
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                strokeWidth={2.5}
              />
              <p className="text-sm text-red-600 font-semibold">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-8 border-t-2 border-[#FFD54F]/30">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-8 py-4 border-2 border-[#A60000] text-[#A60000] font-bold rounded-xl hover:bg-[#A60000] hover:text-white transition-all disabled:opacity-50 tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !availabilityChecked}
              className="px-8 py-4 bg-gradient-to-r from-[#A60000] to-[#FFB200] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#A60000]/50 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 tracking-wide border-2 border-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" strokeWidth={2.5} />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" strokeWidth={2.5} />
                  <span>Update Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;
