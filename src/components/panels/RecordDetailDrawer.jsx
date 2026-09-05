import React from 'react';
import { formatDate, formatDateTime, getDaysUntilExpiry } from '../../lib/insuranceFormatters.js';
import {
  X,
  Building2,
  PhoneCall,
  User,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  MapPin,
  Car,
  Users,
  Send,
  Info
} from 'lucide-react';

export default function RecordDetailDrawer({ record, onClose, onSendMessage }) {
  if (!record) return null;

  const isExp = record.__expired ?? false;
  const daysDiff = getDaysUntilExpiry(record.endDate);
  const companyHelpline = record.phone || 'N/A';
  const ownerPhoneInJson = record.ownerPhone || record.owner_phone || record.ownerContact;

  const handleSendSms = (target) => {
    const phone = target === 'owner' ? ownerPhoneInJson : companyHelpline;
    if (!phone) return;
    if (onSendMessage) {
      onSendMessage(record, phone, target);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg h-full bg-surface border-l border-line shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-surface-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent-hi">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-lg font-bold tracking-wider text-ink">
                  {record.plateNumber || record.plate || 'Policy Record'}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                    isExp
                      ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                      : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                  }`}
                >
                  {isExp ? 'EXPIRED' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-ink-3">
                {record.vehicleBrand || 'Vehicle'} • Contract #{record.contractNumber || 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-3 hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Expiry Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isExp
                ? 'bg-red-950/30 border-red-800/40 text-red-300'
                : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            }`}
          >
            {isExp ? (
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <span className="font-semibold text-sm block">
                {isExp ? 'Policy Expired' : 'Policy Active'}
              </span>
              {daysDiff !== null && (
                <p className="mt-0.5">
                  {isExp
                    ? `Expired ${Math.abs(daysDiff)} days ago on ${formatDate(record.endDate)}.`
                    : `Expires in ${daysDiff} days on ${formatDate(record.endDate)}.`}
                </p>
              )}
            </div>
          </div>

          {/* Contact Details Card: Ins Helpline vs Owner Phone */}
          <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3 text-xs">
            <h4 className="font-semibold text-ink uppercase tracking-wider text-[11px] text-ink-3">
              Contact Numbers
            </h4>

            {/* Insurance Helpline */}
            <div className="flex items-center justify-between border-b border-line-soft pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-accent-hi" />
                <div>
                  <p className="font-medium text-ink">{record.company}</p>
                  <p className="text-[11px] text-ink-3">Insurance Company Helpline</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-ink">{companyHelpline}</span>
                <button
                  onClick={() => handleSendSms('company')}
                  disabled={!companyHelpline}
                  className="px-2 py-1 rounded bg-surface-3 hover:bg-accent hover:text-white text-ink text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30"
                  title="Contact Insurance Helpline"
                >
                  <PhoneCall className="w-3 h-3" /> Call
                </button>
              </div>
            </div>

            {/* Vehicle Owner Phone in JSON */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <div>
                  <p className="font-medium text-ink">Vehicle Owner Phone</p>
                  <p className="text-[11px] text-ink-3">Read directly from JSON</p>
                </div>
              </div>
              <div>
                {ownerPhoneInJson ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-accent-hi">{ownerPhoneInJson}</span>
                    <button
                      onClick={() => handleSendSms('owner')}
                      className="px-2 py-1 rounded bg-accent text-white hover:bg-accent-hi text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      title="Send SMS to Owner"
                    >
                      <Send className="w-3 h-3" /> Msg
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-ink-3 italic bg-surface-3 px-2 py-1 rounded">
                    Not Available
                  </span>
                )}
              </div>
            </div>

            {/* <div className="mt-2 text-[10.5px] text-ink-3 flex items-start gap-1 bg-surface-3 p-2 rounded"> */}
            {/*   <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" /> */}
            {/*   <span> */}
            {/*     Owner's phone number will be included in the JSON file at a later date. When added to the JSON, it automatically displays here. */}
            {/*   </span> */}
            {/* </div> */}
          </div>

          {/* Grid Policy Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
              <div className="flex items-center gap-1.5 text-ink-3">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium">Start Date</span>
              </div>
              <p className="font-mono text-ink text-xs">{formatDateTime(record.startDate)}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
              <div className="flex items-center gap-1.5 text-ink-3">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium">End Date</span>
              </div>
              <p className="font-mono text-ink text-xs">{formatDateTime(record.endDate)}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1">
              <div className="flex items-center gap-1.5 text-ink-3">
                <Users className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium">Contract Type</span>
              </div>
              <p className="text-ink font-medium">{record.contractType || 'Хувь хүн'}</p>
            </div>

            {/* <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-1"> */}
            {/*   <div className="flex items-center gap-1.5 text-ink-3"> */}
            {/*     <Users className="w-3.5 h-3.5 text-accent" /> */}
            {/*     <span className="font-medium">Driver Limit</span> */}
            {/*   </div> */}
            {/*   <p className="text-ink font-medium">{record.limitDrivers ?? 0} drivers</p> */}
            {/* </div> */}
      {/* Address */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1 text-xs">
      <div className="flex items-center gap-1.5 text-ink-3">
      <MapPin className="w-3.5 h-3.5 text-accent" />
      <span className="font-medium">Owner Registered Address</span>
      </div>
      <p className="text-ink">{record.address || 'No address registered'}</p>
      </div>
          </div>

        </div>
      </div>
    </div>
  );
}
