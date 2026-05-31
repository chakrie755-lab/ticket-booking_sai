import React, { useState, useEffect } from "react";
import { Event, Booking } from "./types";
import { INITIAL_EVENTS } from "./data";
import { EventDetails } from "./components/EventDetails";
import { BookingForm } from "./components/BookingForm";
import { BookingSummary } from "./components/BookingSummary";
import { 
  Ticket, 
  Sparkles, 
  History, 
  Trash2, 
  Calendar, 
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Initialize events with dynamic local storage or default data
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const savedEvents = localStorage.getItem("internal_events_tickets");
      return savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  // Track the selected event (defaults to first event)
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");

  // Track historically booked passes
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const savedBookings = localStorage.getItem("internal_events_bookings");
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch {
      return [];
    }
  });

  // Track if there is a newly submitted active booking we are inspecting
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Sync state to local storage when state modifications occur
  useEffect(() => {
    localStorage.setItem("internal_events_tickets", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("internal_events_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // Find the currently selected event object
  const currentSelectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Callback to execute when booking form submits successfully
  const handleBookingSubmit = (bookingData: {
    userName: string;
    userEmail: string;
    userDepartment: string;
    ticketsBooked: number;
  }) => {
    const { userName, userEmail, userDepartment, ticketsBooked } = bookingData;

    // Double check inventory safety
    if (ticketsBooked > currentSelectedEvent.availableTickets) {
      alert("Error: Exceeded available ticket inventory!");
      return;
    }

    // Deduct ticket availability
    const updatedEvents = events.map((evt) => {
      if (evt.id === currentSelectedEvent.id) {
        return {
          ...evt,
          availableTickets: evt.availableTickets - ticketsBooked,
        };
      }
      return evt;
    });

    setEvents(updatedEvents);

    // Create unique booking transaction code
    const deptPrefix = currentSelectedEvent.department
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `TKT-${deptPrefix}-${randomSuffix}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}-${randomSuffix}`,
      eventId: currentSelectedEvent.id,
      eventName: currentSelectedEvent.name,
      userName,
      userEmail,
      userDepartment,
      ticketsBooked,
      totalAmount: ticketsBooked * currentSelectedEvent.price,
      bookingDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      ticketCode,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);
  };

  const handleResetAllInventory = () => {
    if (confirm("Are you sure you want to reset all booking data and restore original starting tickets?")) {
      setEvents(INITIAL_EVENTS);
      setBookings([]);
      setActiveBooking(null);
      if (INITIAL_EVENTS.length > 0) {
        setSelectedEventId(INITIAL_EVENTS[0].id);
      }
    }
  };

  const handleDeleteBooking = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const bookingToCancel = bookings.find((b) => b.id === id);
    if (!bookingToCancel) return;

    if (confirm(`Do you want to cancel the ticket booking: "${bookingToCancel.ticketCode}"? This returns the seats back to available slots.`)) {
      // Return tickets back to inventory
      setEvents((prevEvents) =>
        prevEvents.map((evt) => {
          if (evt.id === bookingToCancel.eventId) {
            return {
              ...evt,
              availableTickets: Math.min(evt.totalTickets, evt.availableTickets + bookingToCancel.ticketsBooked),
            };
          }
          return evt;
        })
      );

      // Remove booking from logs
      setBookings((prev) => prev.filter((b) => b.id !== id));
      
      // Clear active inspection screen if we were viewing that booking
      if (activeBooking?.id === id) {
        setActiveBooking(null);
      }
    }
  };

  // Stats Counters
  const totalBookedSeats = bookings.reduce((sum, b) => sum + b.ticketsBooked, 0);
  const eventsCount = events.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Grid Background Accent overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-slate-900/80 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-550 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-555/15" id="app-logo-badge">
              <Ticket className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2">
                Department Event Central
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.2
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Campus Ticket Reservation Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Real-time event counter badges */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-mono">Total Sales</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{totalBookedSeats} Passes Booked</span>
              </div>
            </div>

            <button
              onClick={handleResetAllInventory}
              className="text-xs font-medium bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-350 hover:text-rose-200 transition-colors py-2 px-3.5 rounded-xl cursor-pointer"
              id="btn-global-reset"
            >
              Reset Database
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        
        {/* Active Booking Summary (Success Screen) has priority layout view */}
        <AnimatePresence mode="wait">
          {activeBooking ? (
            <div className="py-6">
              <div className="text-center mb-6">
                <p className="text-xs text-slate-400">Successfully reserved your seat passes for the seminar. Show this digital stub at checking gates.</p>
              </div>
              <BookingSummary
                booking={activeBooking}
                eventVenue={events.find((e) => e.id === activeBooking.eventId)?.venue || ""}
                eventDateTime={events.find((e) => e.id === activeBooking.eventId)?.dateTime || ""}
                onBookAnother={() => setActiveBooking(null)}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Info banner explaining details */}
              <div className="bg-slate-900/20 border border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">How online booking works</h3>
                    <p className="text-[11px] text-slate-400">Select an event below, fill in your details, and book up to the remaining inventory threshold. We save everything securely in your browser.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-405">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Interactive Realtime Stock</span>
                </div>
              </div>

              {/* Core layout grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Visual spec left module */}
                <div className="lg:col-span-7 space-y-6">
                  <EventDetails
                    events={events}
                    selectedEvent={currentSelectedEvent}
                    onSelectEvent={(evt) => setSelectedEventId(evt.id)}
                  />
                </div>

                {/* Live reservation right module */}
                <div className="lg:col-span-5">
                  <div className="sticky top-24">
                    <BookingForm
                      selectedEvent={currentSelectedEvent}
                      onSubmitBooking={handleBookingSubmit}
                    />
                  </div>
                </div>

              </div>

              {/* Past Bookings / Reservation History Module */}
              <div className="border-t border-slate-900 pt-10" id="historical-bookings-module">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <History className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h2 className="text-lg font-bold text-slate-100 tracking-tight">Your Reserved Access Cards ({bookings.length})</h2>
                      <p className="text-xs text-slate-450">List of active virtual tickets generated during this test session.</p>
                    </div>
                  </div>

                  {bookings.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm("Erase all reserved tickets from your session history? This will NOT restore individual event capacities.")) {
                          setBookings([]);
                        }
                      }}
                      className="text-xs flex items-center gap-1.5 text-rose-450 hover:text-rose-405 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear History
                    </button>
                  )}
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-slate-900/20 border border-dashed border-slate-805 rounded-2xl p-10 text-center max-w-lg mx-auto">
                    <span className="inline-flex w-12 h-12 rounded-full bg-slate-950 border border-slate-805 items-center justify-center text-slate-500 mb-3 font-mono text-xl">
                      #
                    </span>
                    <h3 className="text-sm font-semibold text-slate-300">No Reserved Passes Found</h3>
                    <p className="text-xs text-slate-450 mt-1">
                      You haven't reserved any event tickets yet. Fill in the Booking Form above for any event to instantly generate a pass!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setActiveBooking(b)}
                        className="bg-slate-900/30 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer relative group overflow-hidden flex flex-col justify-between h-40"
                      >
                        {/* Interactive glow effect */}
                        <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full filter blur-xl group-hover:bg-emerald-500/10 transition-colors" />

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-550/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-wider">
                              {b.ticketCode}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {b.bookingDate}
                            </span>
                          </div>

                          <h3 className="text-sm font-semibold text-slate-202 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                            {b.eventName}
                          </h3>

                          <p className="text-xs text-slate-450 mt-1 flex items-center gap-1.5">
                            Guest: <strong className="text-slate-301 font-normal font-sans">{b.userName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-805/45 pt-3 mt-3">
                          <div className="text-xs font-mono">
                            <span className="text-slate-450">{b.ticketsBooked} seat{b.ticketsBooked > 1 ? "s" : ""}</span>
                            <span className="mx-1 text-slate-650">•</span>
                            <span className="text-emerald-450 font-semibold">${b.totalAmount.toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDeleteBooking(b.id, e)}
                              className="p-1 px-2 rounded hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 text-rose-455 hover:text-rose-450 transition-all text-xs cursor-pointer"
                              title="Cancel Ticket Reservation"
                            >
                              Cancel Pass
                            </button>
                            <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5">
                              View Ticket <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding Area */}
      <footer className="border-t border-slate-900/80 mt-20 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-507">
          <div>
            <span>Internal Department Ticketing</span>
            <span className="mx-2">•</span>
            <span>Designed for Campus Seminars, Technical Fests & Workshops</span>
          </div>
          <div>
            <span>Status: Operational (Local Client DB Active)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
