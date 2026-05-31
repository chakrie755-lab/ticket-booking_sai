import React from "react";
import { Event } from "../types";
import { 
  Calendar, 
  MapPin, 
  Building2, 
  DollarSign, 
  Users, 
  Sparkles, 
  Ticket, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "motion/react";

interface EventDetailsProps {
  events: Event[];
  selectedEvent: Event;
  onSelectEvent: (event: Event) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
}) => {
  return (
    <div className="flex flex-col gap-6" id="event-details-module">
      {/* Event Selector Cards */}
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Select Internal Campus Event
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {events.map((evt) => {
            const isSelected = evt.id === selectedEvent.id;
            const isSoldOut = evt.availableTickets === 0;
            const isLowInventory = evt.availableTickets > 0 && evt.availableTickets <= 20;

            return (
              <button
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`flex flex-col justify-between text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/80 border-emerald-500/80 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60"
                }`}
                id={`btn-select-${evt.id}`}
              >
                {/* Accent glow for selected */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full filter blur-xl" />
                )}

                <div>
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-slate-850/80 text-slate-300 border border-slate-805 uppercase tracking-wider mb-2 inline-block">
                    {evt.department.split(" ")[0]}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-emerald-300">
                    {evt.name}
                  </h3>
                </div>

                <div className="mt-3 flex items-center justify-between w-full border-t border-slate-805/40 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-305 font-mono">
                      {isSoldOut ? (
                        <span className="text-rose-450 font-bold">SOLD OUT</span>
                      ) : (
                        <span>
                          <strong className="text-slate-100">{evt.availableTickets}</strong> seats
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-xs font-semibold font-mono text-emerald-400">
                    ${evt.price.toFixed(2)}
                  </span>
                </div>

                {isLowInventory && !isSoldOut && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-450 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Event Detailed Display Card */}
      <motion.div
        key={selectedEvent.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
        id={`featured-event-detail-${selectedEvent.id}`}
      >
        <div className="relative h-48 md:h-64 overflow-hidden">
          {/* Background image blur back-plate */}
          <img
            src={selectedEvent.imageUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-50 opacity-40 scale-105"
          />
          {/* Main event cover image */}
          <img
            src={selectedEvent.imageUrl}
            alt={selectedEvent.name}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-700 hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Absolute Tags */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {selectedEvent.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50 text-emerald-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md rounded-lg px-3 py-1 border border-slate-805/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-slate-100">
                {selectedEvent.availableTickets} / {selectedEvent.totalTickets} Available
              </span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold tracking-tight">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span>{selectedEvent.department}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">
              {selectedEvent.name}
            </h1>
          </div>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            {selectedEvent.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-slate-800 py-6 mb-2">
            <div className="flex items-stretch gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest font-mono">Date & Time</span>
                <span className="text-sm font-medium text-slate-200">{selectedEvent.dateTime}</span>
              </div>
            </div>

            <div className="flex items-stretch gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest font-mono">Campus Venue</span>
                <span className="text-sm font-medium text-slate-200">{selectedEvent.venue}</span>
              </div>
            </div>

            <div className="flex items-stretch gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest font-mono">Admission Fee</span>
                <span className="text-sm font-bold font-mono text-slate-100">
                  {selectedEvent.price === 0 ? (
                    <span className="text-emerald-400 uppercase tracking-wider font-sans text-xs">Free Admission</span>
                  ) : (
                    <span>${selectedEvent.price.toFixed(2)} USD</span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-stretch gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest font-mono">Seating / Capacity</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-205">
                    {selectedEvent.availableTickets} available of {selectedEvent.totalTickets} total
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance progress visualizer bar */}
          <div className="pt-4">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-slate-400">Total Booking Progress</span>
              <span className="text-slate-300">
                {Math.round(((selectedEvent.totalTickets - selectedEvent.availableTickets) / selectedEvent.totalTickets) * 100)}% Booked
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-550 rounded-full ${
                  selectedEvent.availableTickets <= 10 
                    ? "bg-rose-500" 
                    : selectedEvent.availableTickets <= 30 
                    ? "bg-amber-500" 
                    : "bg-emerald-500"
                }`}
                style={{ width: `${((selectedEvent.totalTickets - selectedEvent.availableTickets) / selectedEvent.totalTickets) * 100}%` }}
              />
            </div>
            
            {selectedEvent.availableTickets === 0 ? (
              <div className="mt-3 flex items-center gap-2 text-rose-400 bg-rose-950/20 px-3.5 py-2 rounded-xl border border-rose-900/30 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>All tickets sold out. Select another event from the catalogue to book a pass.</span>
              </div>
            ) : selectedEvent.availableTickets <= 15 ? (
              <div className="mt-3 flex items-center gap-2 text-amber-400 bg-amber-950/20 px-3.5 py-2 rounded-xl border border-amber-900/30 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Tickets are running low for this departmental event! Reserve your spots now.</span>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
