// src/pages/hallBooking/BookingCalendarPage.jsx - Clean White Design
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Building2,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";

const BookingCalendarPage = () => {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [halls, setHalls] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({
    morning: true,
    evening: true,
  });
  const [bookedDates, setBookedDates] = useState({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch halls on mount
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await api.get("/hall-booking/halls?per_page=100");
        setHalls(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  // Fetch bookings for the current month to show on calendar
  useEffect(() => {
    fetchMonthBookings();
  }, [currentMonth]);

  const fetchMonthBookings = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");

      const response = await api.get(
        `/hall-booking/bookings?year=${year}&month=${month}`
      );

      const bookingsByDate = {};
      if (response.data.data) {
        response.data.data.forEach((booking) => {
          const dateOnly = booking.event_date.split("T")[0];
          if (!bookingsByDate[dateOnly]) {
            bookingsByDate[dateOnly] = [];
          }
          bookingsByDate[dateOnly].push(booking);
        });
      }

      setBookedDates(bookingsByDate);
    } catch (error) {
      console.error("Failed to fetch month bookings:", error);
      setBookedDates({});
    }
  };

  // Check availability when date and hall are selected
  useEffect(() => {
    if (selectedDate && selectedHall) {
      checkAvailabilityForDate();
    }
  }, [selectedDate, selectedHall]);

  const checkAvailabilityForDate = async () => {
    if (!selectedDate || !selectedHall) return;

    setCheckingAvailability(true);
    const dateStr = formatDate(selectedDate);

    try {
      const morningResponse = await api.post(
        "/hall-booking/halls/check-availability",
        {
          hall_id: selectedHall,
          event_date: dateStr,
          time_slot: "morning",
        }
      );

      const eveningResponse = await api.post(
        "/hall-booking/halls/check-availability",
        {
          hall_id: selectedHall,
          event_date: dateStr,
          time_slot: "evening",
        }
      );

      setAvailableSlots({
        morning: morningResponse.data.data.is_available,
        evening: eveningResponse.data.data.is_available,
      });

      if (
        selectedTimeSlot === "morning" &&
        !morningResponse.data.data.is_available
      ) {
        setSelectedTimeSlot(null);
      }
      if (
        selectedTimeSlot === "evening" &&
        !eveningResponse.data.data.is_available
      ) {
        setSelectedTimeSlot(null);
      }
    } catch (error) {
      console.error("Failed to check availability:", error);
      setAvailableSlots({ morning: true, evening: true });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const hasBookings = (date) => {
    if (!date) return false;
    const dateStr = formatDate(date);
    return bookedDates[dateStr] && bookedDates[dateStr].length > 0;
  };

  const handleDateClick = (date) => {
    if (!date || isPastDate(date)) return;
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedHall && selectedTimeSlot) {
      navigate("/hall/bookings/create", {
        state: {
          prefilledData: {
            event_date: formatDate(selectedDate),
            hall_id: selectedHall,
            time_slot: selectedTimeSlot,
          },
        },
      });
    }
  };

  const handleBack = () => {
    navigate("/hall/bookings");
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const chineseMonths = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  return (
    <div className="h-screen bg-gray-50 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Select Event Date
                  </h1>
                  <p className="text-sm text-gray-600">
                    Choose date, hall, and time slot · 选择日期和时段
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid - Calendar + Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Calendar Section - 2 columns */}
          <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0 overflow-hidden">
            {/* Month Navigation */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {chineseMonths[currentMonth.getMonth()]}
                  </p>
                </div>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
              {/* Weekday Headers - Clean Gray */}
              <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, idx) => (
                    <div
                      key={day}
                      className="p-3 text-center border-r border-gray-200 last:border-r-0"
                    >
                      <span className="text-sm font-semibold text-gray-700 block">
                        {day}
                      </span>
                      <span className="text-xs text-gray-500">
                        {["日", "一", "二", "三", "四", "五", "六"][idx]}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 bg-white flex-1 overflow-auto">
                {days.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="border border-gray-100 aspect-square"
                      />
                    );
                  }

                  const isPast = isPastDate(date);
                  const isSelected =
                    selectedDate &&
                    formatDate(date) === formatDate(selectedDate);
                  const hasEvents = hasBookings(date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateClick(date)}
                      disabled={isPast}
                      className={`
                        border border-gray-100 aspect-square flex flex-col items-center justify-center
                        transition-all duration-200 relative group p-2
                        ${
                          isPast
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                            : ""
                        }
                        ${
                          !isPast && !isSelected
                            ? "bg-white hover:bg-red-50 text-gray-900 cursor-pointer"
                            : ""
                        }
                        ${
                          isSelected
                            ? "bg-red-600 text-white shadow-lg ring-2 ring-red-600 ring-offset-2"
                            : ""
                        }
                      `}
                    >
                      <span
                        className={`text-lg font-bold ${
                          isSelected ? "text-white" : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {/* Booking Indicator Dots - Red */}
                      {hasEvents && !isSelected && (
                        <div className="absolute bottom-2 flex gap-0.5">
                          {bookedDates[formatDate(date)]
                            .slice(0, 3)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-red-500"
                              />
                            ))}
                        </div>
                      )}

                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-white absolute top-1 right-1" />
                      )}

                      {/* Tooltip */}
                      {!isPast && !isSelected && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                            {hasEvents
                              ? `${
                                  bookedDates[formatDate(date)].length
                                } booking(s)`
                              : "Available"}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-around flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-700">Past</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  </div>
                  <span className="text-sm text-gray-700">Has Bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <span className="text-sm text-gray-700">Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Panel - Clean White */}
          <div className="lg:col-span-1 flex flex-col min-h-0">
            {selectedDate ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                  <CalendarIcon className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Selected Date · 已选日期
                  </h3>
                </div>

                {/* Selected Date Display */}
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100 flex-shrink-0">
                  <p className="text-4xl font-bold text-red-600 mb-1">
                    {selectedDate.getDate()}
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">
                    {monthNames[selectedDate.getMonth()]}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedDate.getFullYear()}
                  </p>
                </div>

                {/* Hall Selection */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                        Select Hall · 选择大厅
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {halls.map((hall) => (
                        <button
                          key={hall.id}
                          onClick={() => {
                            setSelectedHall(hall.id);
                            setSelectedTimeSlot(null);
                          }}
                          className={`
                          w-full p-3 rounded-lg text-left transition-all duration-200 border-2
                          ${
                            selectedHall === hall.id
                              ? "bg-red-50 border-red-600 shadow-sm"
                              : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          }
                        `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`font-semibold text-sm ${
                                  selectedHall === hall.id
                                    ? "text-red-700"
                                    : "text-gray-900"
                                }`}
                              >
                                {hall.hall_name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Capacity: {hall.capacity}
                              </p>
                            </div>
                            {selectedHall === hall.id && (
                              <CheckCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedHall && (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                          Time Slot · 时段
                        </h4>
                      </div>

                      {checkingAvailability ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">
                            Checking availability...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {availableSlots.morning ? (
                            <button
                              onClick={() => setSelectedTimeSlot("morning")}
                              className={`
                              w-full p-3 rounded-lg transition-all duration-200 border-2
                              ${
                                selectedTimeSlot === "morning"
                                  ? "bg-red-50 border-red-600 shadow-sm"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              }
                            `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-left">
                                  <p
                                    className={`font-semibold text-sm ${
                                      selectedTimeSlot === "morning"
                                        ? "text-red-700"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    Morning · 上午
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    9:00 AM - 2:00 PM
                                  </p>
                                </div>
                                {selectedTimeSlot === "morning" && (
                                  <CheckCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </button>
                          ) : (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <p className="font-semibold text-sm text-red-700">
                                  Morning Unavailable
                                </p>
                              </div>
                            </div>
                          )}

                          {availableSlots.evening ? (
                            <button
                              onClick={() => setSelectedTimeSlot("evening")}
                              className={`
                              w-full p-3 rounded-lg transition-all duration-200 border-2
                              ${
                                selectedTimeSlot === "evening"
                                  ? "bg-red-50 border-red-600 shadow-sm"
                                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
                              }
                            `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-left">
                                  <p
                                    className={`font-semibold text-sm ${
                                      selectedTimeSlot === "evening"
                                        ? "text-red-700"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    Evening · 晚上
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    6:00 PM - 11:00 PM
                                  </p>
                                </div>
                                {selectedTimeSlot === "evening" && (
                                  <CheckCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </button>
                          ) : (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <p className="font-semibold text-sm text-red-700">
                                  Evening Unavailable
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Confirm Button */}
                {selectedDate && selectedHall && selectedTimeSlot && (
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-red-700 transition-all duration-200 flex items-center justify-center space-x-2 mt-4 flex-shrink-0"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Continue to Booking · 继续预订</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center sticky top-4">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Select a Date
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Click on an available date to begin
                </p>
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    选择一个日期开始预订
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* At the end, before closing div */}
      <style>{`
  /* Custom scrollbar for selection panel */
  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 10px;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #b91c1c;
  }
`}</style>
    </div>
  );
};

export default BookingCalendarPage;
