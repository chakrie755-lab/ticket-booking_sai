import React, { useState, useEffect } from "react";
import { Event, Booking } from "../types";
import { 
  User, 
  Mail, 
  Building2, 
  Ticket, 
  RefreshCw, 
  AlertCircle, 
  CreditCard 
} from "lucide-react";

interface BookingFormProps {
  selectedEvent: Event;
  onSubmitBooking: (bookingData: {
    userName: string;
    userEmail: string;
    userDepartment: string;
    ticketsBooked: number;
  }) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedEvent,
  onSubmitBooking,
}) => {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [ticketsCount, setTicketsCount] = useState<string>("1");

  // Errors state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    department?: string;
    ticketsCount?: string;
  }>({});

  // Reset form when selected event changes or when user manually clicks reset
  const handleReset = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setTicketsCount("1");
    setErrors({});
  };

  useEffect(() => {
    // Reset tickets count if it exceeds available tickets of new selected event
    const available = selectedEvent.availableTickets;
    const current = parseInt(ticketsCount, 10);
    if (available > 0 && current > available) {
      setTicketsCount("1");
    }
  }, [selectedEvent]);

  // Handle live fields validation
  const validateField = (fieldName: string, value: string) => {
    const nextErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          nextErrors.name = "Full name is required";
        } else if (value.trim().length < 2) {
          nextErrors.name = "Name must be at least 2 characters";
        } else {
          delete nextErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          nextErrors.email = "Email ID is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          nextErrors.email = "Please enter a valid email address";
        } else {
          delete nextErrors.email;
        }
        break;

      case "department":
        if (!value.trim()) {
          nextErrors.department = "Department name is required";
        } else {
          delete nextErrors.department;
        }
        break;

      case "ticketsCount":
        const parsed = parseInt(value, 10);
        if (!value) {
          nextErrors.ticketsCount = "Ticket count is required";
        } else if (isNaN(parsed) || parsed <= 0) {
          nextErrors.ticketsCount = "Tickets required must be a positive number";
        } else if (parsed > selectedEvent.availableTickets) {
          nextErrors.ticketsCount = `Only ${selectedEvent.availableTickets} tickets are available!`;
        } else {
          delete nextErrors.ticketsCount;
        }
        break;

      default:
        break;
    }

    setErrors(nextErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "department") setDepartment(value);
    if (name === "ticketsCount") setTicketsCount(value);

    // Validate on-the-fly
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger full validation
    const validationErrors: typeof errors = {};

    if (!name.trim()) validationErrors.name = "Full name is required";
    else if (name.trim().length < 2) validationErrors.name = "Name must be at least 2 characters";

    if (!email.trim()) validationErrors.email = "Email ID is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validationErrors.email = "Please enter a valid email address";

    if (!department.trim()) validationErrors.department = "Department name is required";

    const parsedTickets = parseInt(ticketsCount, 10);
    if (!ticketsCount) validationErrors.ticketsCount = "Ticket count is required";
    else if (isNaN(parsedTickets) || parsedTickets <= 0) {
      validationErrors.ticketsCount = "Tickets required must be a positive number";
    } else if (parsedTickets > selectedEvent.availableTickets) {
      validationErrors.ticketsCount = `Only ${selectedEvent.availableTickets} tickets remaining`;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Success - trigger booking submit!
    onSubmitBooking({
      userName: name.trim(),
      userEmail: email.trim(),
      userDepartment: department,
      ticketsBooked: parsedTickets,
    });

    // Clear form after successful booking
    handleReset();
  };

  const currentTicketsNumeric = parseInt(ticketsCount, 10) || 0;
  const totalAmountCalculated = currentTicketsNumeric * selectedEvent.price;
  const isSoldOut = selectedEvent.availableTickets === 0;

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between" id="booking-form-module">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-400" />
              Book Your Pass
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your event, fill out the form, and instantly receive your ticket.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/40 hover:bg-slate-800/70 py-1.5 px-3 rounded-lg border border-slate-800/80 cursor-pointer"
            id="btn-reset-form"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Form
          </button>
        </div>

        {isSoldOut ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-950/20 border border-dashed border-rose-900/30 rounded-2xl px-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-200 text-sm">Event Booking Unavailable</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              "<strong>{selectedEvent.name}</strong>" is fully booked. Please choose a different event from the menu above to reserve tickets.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Name */}
            <div>
              <label htmlFor="input-name" className="block text-xs font-semibold text-slate-350 mb-1.5 font-sans">
                Full Name <span className="text-rose-450 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="input-name"
                  name="name"
                  value={name}
                  onChange={handleInputChange}
                  placeholder="e.g. Prof. Alice Smith / John Doe"
                  className={`w-full bg-slate-950/40 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.name
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5" id="error-name">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div>
              <label htmlFor="input-email" className="block text-xs font-semibold text-slate-350 mb-1.5 font-sans">
                Email Address <span className="text-rose-450 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-455">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="input-email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="e.g. john.doe@university.edu"
                  className={`w-full bg-slate-950/40 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.email
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5" id="error-email">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Input Department (Select Dropdown) */}
            <div>
              <label htmlFor="input-department" className="block text-xs font-semibold text-slate-350 mb-1.5 font-sans">
                Your Department <span className="text-rose-450 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-455">
                  <Building2 className="w-4 h-4" />
                </span>
                <select
                  id="input-department"
                  name="department"
                  value={department}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/40 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-250 focus:outline-none focus:ring-1 appearance-none transition-all duration-200 cursor-pointer ${
                    errors.department
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                >
                  <option value="" className="bg-slate-950 text-slate-400">-- Select Department --</option>
                  <option value="Computer Science & Engineering" className="bg-slate-950 text-slate-200">Computer Science & Engineering</option>
                  <option value="Information Technology" className="bg-slate-950 text-slate-200">Information Technology</option>
                  <option value="Electronics & Communication Engineering" className="bg-slate-950 text-slate-200">Electronics & Communication Engineering</option>
                  <option value="Biotechnology & Bio-Sciences" className="bg-slate-950 text-slate-200">Biotechnology & Bio-Sciences</option>
                  <option value="Mechanical Engineering" className="bg-slate-950 text-slate-200">Mechanical Engineering</option>
                  <option value="Business & MBA Research" className="bg-slate-950 text-slate-200">Business & MBA Research</option>
                  <option value="Science, Humanities & Arts" className="bg-slate-950 text-slate-200">Science, Humanities & Arts</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  ▼
                </span>
              </div>
              {errors.department && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5" id="error-department">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Ticket Counter */}
            <div>
              <label htmlFor="input-tickets" className="block text-xs font-semibold text-slate-350 mb-1.5 font-sans">
                Number of Tickets Required <span className="text-rose-450 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-455">
                  <Ticket className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  id="input-tickets"
                  name="ticketsCount"
                  min="1"
                  max={selectedEvent.availableTickets}
                  value={ticketsCount}
                  onChange={handleInputChange}
                  className={`w-full bg-slate-950/40 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 transition-all duration-200 ${
                    errors.ticketsCount
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20"
                  }`}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 py-1 text-[10px] font-semibold text-slate-500 font-mono">
                  Max: {selectedEvent.availableTickets}
                </span>
              </div>
              {errors.ticketsCount && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1.5" id="error-tickets">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.ticketsCount}
                </p>
              )}
            </div>

            {/* Pricing Live summary widget */}
            <div className="bg-slate-950/40 border border-slate-850/50 rounded-xl p-4 mt-6">
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                <span>Unit Ticket Price</span>
                <span>${selectedEvent.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 font-mono mt-1">
                <span>Quantity</span>
                <span>x {currentTicketsNumeric}</span>
              </div>
              <div className="border-t border-slate-800/80 my-2.5" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Total Amount Due
                </span>
                <span className="text-lg font-extrabold font-mono text-emerald-400" id="live-total-amount">
                  ${totalAmountCalculated.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submission button */}
            <button
              type="submit"
              className="w-full bg-emerald-550 hover:bg-emerald-600 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all duration-200 mt-6 shadow-lg shadow-emerald-555/10 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              id="btn-submit-booking"
            >
              <Ticket className="w-4 h-4" />
              Confirm Ticket Purchase
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
