import React, { useState } from "react";
import { Booking } from "../types";
import { 
  CheckCircle, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ShieldCheck 
} from "lucide-react";
import { motion } from "motion/react";

interface BookingSummaryProps {
  booking: Booking;
  eventVenue: string;
  eventDateTime: string;
  onBookAnother: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  booking,
  eventVenue,
  eventDateTime,
  onBookAnother,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      id="booking-summary-module"
    >
      {/* Decorative top success banner */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-6 py-8 text-center border-b border-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-500/10 rounded-full filter blur-xl" />

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-slate-50 tracking-tight">Booking Confirmed!</h2>
        <p className="text-sm text-emerald-300 mt-1 flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-4 h-4" />
          Seat reserved successfully
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Ticket Stub Design layout */}
        <div className="relative border-2 border-slate-800 bg-slate-950/60 rounded-2xl p-6 overflow-hidden">
          {/* Side notches representing physical ticket cuts */}
          <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-slate-950 rounded-full border-r-2 border-slate-800 -translate-y-1/2 z-10 hidden sm:block" />
          <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-slate-950 rounded-full border-l-2 border-slate-800 -translate-y-1/2 z-10 hidden sm:block" />

          {/* Ticket Body Content */}
          <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-dashed border-slate-800">
            <div className="flex-1 space-y-4">
              <div>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                  Official Entry Pass
                </span>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight mt-2">{booking.eventName}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="text-slate-400 flex items-start gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Date & Time</span>
                    <span className="text-slate-300 font-sans text-xs">{eventDateTime}</span>
                  </div>
                </div>

                <div className="text-slate-400 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Venue Location</span>
                    <span className="text-slate-300 font-sans text-xs">{eventVenue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Code and Price Column */}
            <div className="md:w-44 flex flex-col items-start md:items-end md:text-right justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Reference Code</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono font-bold text-sm text-slate-205 py-0.5 px-2 bg-slate-900 border border-slate-800 rounded">
                    {booking.ticketCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Transaction Value</span>
                <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                  ${booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Pass Holder</span>
                <span className="text-slate-200 font-semibold font-sans">{booking.userName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Department</span>
                <span className="text-slate-200 font-sans">{booking.userDepartment.split(" ")[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Reserved Passes</span>
                <span className="text-slate-200 font-bold text-sm underline decoration-emerald-500/60 decoration-2">
                  {booking.ticketsBooked} seat{booking.ticketsBooked > 1 ? "s" : ""}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-505 block text-[10px] uppercase tracking-wider">Email Contact</span>
                <span className="text-slate-350 truncate block max-w-[200px]">{booking.userEmail}</span>
              </div>
            </div>

            {/* Simulated QR Code / Barcode decoration */}
            <div className="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 self-center mx-auto sm:mr-0 flex-shrink-0">
              <div className="w-16 h-16 bg-slate-950 flex flex-wrap p-1 gap-0.5 justify-center items-center">
                {/* Visual grid representing a mock barcode/QR block */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-xs ${
                      (i * 7 + 13) % 4 === 0 || i === 0 || i === 8 ? "bg-white" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[8px] text-slate-500 font-mono mt-1 tracking-widest uppercase">Verified</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onBookAnother}
            className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-700/60 cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Book Another Event Ticket
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 bg-emerald-550 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-555/5 cursor-pointer text-sm"
          >
            <Printer className="w-4 h-4" />
            Print Entry Pass
          </button>
        </div>
      </div>
    </motion.div>
  );
};
