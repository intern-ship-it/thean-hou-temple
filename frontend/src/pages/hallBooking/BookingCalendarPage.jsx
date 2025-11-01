// src/pages/hallBooking/BookingCalendarPage.jsx
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
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 overflow-hidden flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full">
        {/* Compact Header */}
        <div className="mb-3 flex-shrink-0">
          <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    选择日期 Select Event Date
                  </h1>
                  <p className="text-xs text-gray-600">
                    Choose date, hall, and time slot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid - Calendar + Selection */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 flex-1 min-h-0">
          {/* Calendar Section - 2 columns */}
          <div className="xl:col-span-2 flex flex-col space-y-3 min-h-0">
            {/* Compact Month Navigation */}
            <div className="bg-white rounded-xl p-2 shadow-md border border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
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

            {/* Calendar Grid - Flexible height */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
              {/* Compact Weekday Headers */}
              <div className="grid grid-cols-7 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, idx) => (
                    <div
                      key={day}
                      className="p-2 text-center border-r border-blue-500 last:border-r-0"
                    >
                      <span className="text-xs font-bold text-white block">
                        {day}
                      </span>
                      <span className="text-[10px] text-blue-100">
                        {["日", "一", "二", "三", "四", "五", "六"][idx]}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days - Flexible grid */}
              <div className="grid grid-cols-7 bg-white flex-1 auto-rows-fr">
                {days.map((date, index) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="border border-gray-100"
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
                        border border-gray-100 flex flex-col items-center justify-center
                        transition-all duration-200 relative group p-1 min-h-0
                        ${
                          isPast
                            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                            : ""
                        }
                        ${
                          !isPast && !isSelected
                            ? "bg-white hover:bg-blue-50 text-gray-900 cursor-pointer"
                            : ""
                        }
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105 z-10"
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

                      {/* Booking Indicator Dots */}
                      {hasEvents && !isSelected && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {bookedDates[formatDate(date)]
                            .slice(0, 3)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="w-1 h-1 rounded-full bg-purple-500"
                              />
                            ))}
                        </div>
                      )}

                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-white absolute top-0.5 right-0.5" />
                      )}

                      {!isPast && !isSelected && (
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap">
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

            {/* Compact Legend */}
            <div className="bg-white rounded-xl p-2 shadow-md border border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-around flex-wrap gap-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded"></div>
                  <span className="text-[10px] text-gray-700">Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-[10px] text-gray-700">Past</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                    <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-[10px] text-gray-700">Bookings</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
                  <span className="text-[10px] text-gray-700">Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Panel - 1 column with internal scroll */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            {selectedDate ? (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg border border-blue-400 flex flex-col min-h-0 h-full">
                <h3 className="text-xs font-bold text-white mb-2 uppercase tracking-wide flex items-center flex-shrink-0">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  Selected Date 已选日期
                </h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3 flex-shrink-0">
                  <p className="text-3xl font-bold text-white mb-0.5">
                    {selectedDate.getDate()}
                  </p>
                  <p className="text-base text-white/90 font-semibold">
                    {monthNames[selectedDate.getMonth()]}
                  </p>
                  <p className="text-sm text-white/80">
                    {selectedDate.getFullYear()}
                  </p>
                </div>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1 custom-scrollbar">
                  {/* Hall Selection */}
                  <div>
                    <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide flex items-center sticky top-0 bg-gradient-to-br from-blue-500 to-purple-600 pb-1">
                      <Building2 className="w-3 h-3 mr-1" />
                      Select Hall 选择大厅
                    </h4>
                    <div className="space-y-1.5">
                      {halls.map((hall) => (
                        <button
                          key={hall.id}
                          onClick={() => {
                            setSelectedHall(hall.id);
                            setSelectedTimeSlot(null);
                          }}
                          className={`
                            w-full p-2 rounded-lg text-left transition-all duration-200
                            ${
                              selectedHall === hall.id
                                ? "bg-white text-gray-900 shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`font-bold text-xs ${
                                  selectedHall === hall.id
                                    ? "text-gray-900"
                                    : "text-white"
                                }`}
                              >
                                {hall.hall_name}
                              </p>
                              <p
                                className={`text-[10px] ${
                                  selectedHall === hall.id
                                    ? "text-gray-600"
                                    : "text-white/80"
                                }`}
                              >
                                Capacity: {hall.capacity}
                              </p>
                            </div>
                            {selectedHall === hall.id && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  {selectedHall && (
                    <div>
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide flex items-center sticky top-0 bg-gradient-to-br from-blue-500 to-purple-600 pb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Time Slot 时段
                      </h4>

                      {checkingAvailability ? (
                        <div className="bg-white/20 rounded-lg p-3 text-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto mb-1"></div>
                          <p className="text-white text-[10px]">Checking...</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {availableSlots.morning ? (
                            <button
                              onClick={() => setSelectedTimeSlot("morning")}
                              className={`
                                w-full p-2 rounded-lg transition-all duration-200
                                ${
                                  selectedTimeSlot === "morning"
                                    ? "bg-white text-gray-900 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-left">
                                  <p
                                    className={`font-bold text-xs ${
                                      selectedTimeSlot === "morning"
                                        ? "text-gray-900"
                                        : "text-white"
                                    }`}
                                  >
                                    Morning 上午
                                  </p>
                                  <p
                                    className={`text-[10px] ${
                                      selectedTimeSlot === "morning"
                                        ? "text-gray-600"
                                        : "text-white/80"
                                    }`}
                                  >
                                    9:00 AM - 2:00 PM
                                  </p>
                                </div>
                                {selectedTimeSlot === "morning" && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </button>
                          ) : (
                            <div className="bg-red-100/20 border border-red-300/30 rounded-lg p-2">
                              <div className="flex items-center space-x-1.5">
                                <XCircle className="w-3 h-3 text-red-200" />
                                <p className="font-bold text-[10px] text-red-100">
                                  Morning Unavailable
                                </p>
                              </div>
                            </div>
                          )}

                          {availableSlots.evening ? (
                            <button
                              onClick={() => setSelectedTimeSlot("evening")}
                              className={`
                                w-full p-2 rounded-lg transition-all duration-200
                                ${
                                  selectedTimeSlot === "evening"
                                    ? "bg-white text-gray-900 shadow-lg"
                                    : "bg-white/20 text-white hover:bg-white/30"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-left">
                                  <p
                                    className={`font-bold text-xs ${
                                      selectedTimeSlot === "evening"
                                        ? "text-gray-900"
                                        : "text-white"
                                    }`}
                                  >
                                    Evening 晚上
                                  </p>
                                  <p
                                    className={`text-[10px] ${
                                      selectedTimeSlot === "evening"
                                        ? "text-gray-600"
                                        : "text-white/80"
                                    }`}
                                  >
                                    6:00 PM - 11:00 PM
                                  </p>
                                </div>
                                {selectedTimeSlot === "evening" && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            </button>
                          ) : (
                            <div className="bg-red-100/20 border border-red-300/30 rounded-lg p-2">
                              <div className="flex items-center space-x-1.5">
                                <XCircle className="w-3 h-3 text-red-200" />
                                <p className="font-bold text-[10px] text-red-100">
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

                {/* Confirm Button - Fixed at bottom */}
                {selectedDate && selectedHall && selectedTimeSlot && (
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-white text-blue-600 font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 mt-3 flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Continue 继续预订</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Select a Date
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Click on an available date to begin
                </p>
                <div className="flex items-center justify-center space-x-1.5 text-blue-600">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-semibold text-xs">
                    选择一个日期开始预订
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default BookingCalendarPage;
