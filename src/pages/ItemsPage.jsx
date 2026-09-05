import React, { useRef, useState } from 'react';
import { useStore } from '../store/AppStore.jsx';
import { useVirtualizer } from '@tanstack/react-virtual';
import { formatDate } from '../lib/insuranceFormatters.js';
import RecordDetailDrawer from '../components/panels/RecordDetailDrawer.jsx';
import {
  Search,
  Building2,
  PhoneCall,
  User,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Inbox,
  Filter
} from 'lucide-react';

export default function ItemsPage() {
  const {
    filteredItems,
    query,
    setQuery,
    activeTab,
    setActiveTab,
    selectedCompany,
    setSelectedCompany,
    companiesList,
    selectedRecord,
    selectRecord
  } = useStore();

  const [toast, setToast] = useState('');

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 58,
    overscan: 10
  });

  const handleSendMessage = (record, targetPhone, targetType) => {
    const plate = record.plateNumber || record.plate || 'Vehicle';
    setToast(`Queued contact to ${targetType === 'owner' ? 'Owner' : 'Ins. Helpline'} (${targetPhone}) for ${plate}`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-plane">
      {/* Filter Bar & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 shrink-0">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-accent/15 text-accent-hi border border-accent/30'
                : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            All Records
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'active'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'expiring'
                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            Expiring Soon
          </button>

          <button
            onClick={() => setActiveTab('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'expired'
                ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                : 'text-ink-3 hover:bg-surface-2 hover:text-ink'
            }`}
          >
            Expired
          </button>
        </div>

        {/* Company Dropdown Filter & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="appearance-none rounded-lg border border-line bg-surface-2 px-3 py-1.5 pr-8 text-xs text-ink focus:border-accent focus:outline-none cursor-pointer"
            >
              <option value="all">All Insurance Companies ({companiesList.length})</option>
              {companiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-ink-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <span className="text-xs text-ink-3 font-mono">
            <b>{filteredItems.length.toLocaleString()}</b> shown
          </span>
        </div>
      </div>

      {/* Table Column Headers */}
      <div className="hidden md:grid grid-cols-12 items-center gap-2 border-b border-line bg-surface-2 px-6 py-2 text-[11px] font-mono font-medium uppercase tracking-wider text-ink-3 shrink-0">
        <div className="col-span-3">Plate & Vehicle</div>
        <div className="col-span-3">Insurance Company</div>
        <div className="col-span-2">Status / Expiry</div>
        <div className="col-span-4 text-right">Helpline & Owner Contact</div>
      </div>

      {/* Virtualized Table List */}
      <div className="flex-1 relative overflow-hidden bg-plane">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Inbox className="w-10 h-10 text-ink-3 mb-2" />
            <p className="text-sm font-medium text-ink">No policy records found</p>
            <p className="text-xs text-ink-3 mt-1">
              {query ? `No records match "${query}"` : 'Try adjusting active filters.'}
            </p>
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-full overflow-y-auto relative w-full custom-scrollbar"
          >
            <div
              className="w-full relative"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const record = filteredItems[virtualRow.index];
                const isExp = record.__expired ?? false;
                const plateText = record.plateNumber || record.plate || '—';
                const companyName = record.company || '—';
                const companyPhone = record.phone || '';
                const ownerPhoneInJson = record.ownerPhone || record.owner_phone || record.ownerContact;

                return (
                  <div
                    key={record.id || record.key || virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: `${virtualRow.start}px`,
                      height: `${virtualRow.size}px`,
                      left: 0,
                      right: 0
                    }}
                    onClick={() => selectRecord(record)}
                    className="group flex items-center border-b border-line-soft px-4 md:px-6 text-[13px] hover:bg-surface-2/60 transition-colors cursor-pointer"
                  >
                    <div className="grid w-full grid-cols-12 items-center gap-2 py-2">
                      {/* Plate & Brand */}
                      <div className="col-span-4 md:col-span-3 flex flex-col">
                        <span className="font-mono text-[13.5px] font-bold text-ink group-hover:text-accent-hi transition-colors">
                          {plateText}
                        </span>
                        <span className="text-[11px] text-ink-3 truncate">
                          {record.vehicleBrand || 'Vehicle'} • {record.contractType || 'Хувь хүн'}
                        </span>
                      </div>

                      {/* Insurance Company & Contract */}
                      <div className="col-span-5 md:col-span-3 flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 text-ink font-medium truncate">
                          <Building2 className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="truncate">{companyName}</span>
                        </div>
                        <span className="font-mono text-[11px] text-ink-3 truncate">
                          {record.contractNumber ? `#${record.contractNumber}` : '—'}
                        </span>
                      </div>

                      {/* Status / Expiry */}
                      <div className="hidden md:flex col-span-2 flex-col justify-center">
                        <span
                          className={`inline-flex items-center gap-1 w-fit rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isExp
                              ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                              : record.__expiringSoon
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          }`}
                        >
                          {isExp ? 'EXPIRED' : record.__expiringSoon ? `${record.__daysUntilExpiry}D LEFT` : 'ACTIVE'}
                        </span>
                        <span className="font-mono text-[11px] text-ink-3 mt-0.5">
                          {formatDate(record.endDate)}
                        </span>
                      </div>

                      {/* Phone Contacts */}
                      <div className="col-span-3 md:col-span-4 flex items-center justify-end gap-3">
                        <div className="flex flex-col items-end text-right">
                          {ownerPhoneInJson ? (
                            <span className="font-mono text-[11.5px] font-bold text-accent-hi flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded">
                              <User className="w-3 h-3 text-accent" /> {ownerPhoneInJson}
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-ink-3 italic">
                              Owner Phone: Not Available
                            </span>
                          )}
                          <span className="text-[10px] text-ink-3">
                            Ins Helpline: {companyPhone || '—'}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectRecord(record);
                          }}
                          className="p-1.5 rounded text-ink-3 hover:text-ink hover:bg-surface-3 transition-colors"
                          title="View complete record details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Record Details Slide-Over Drawer */}
      <RecordDetailDrawer
        record={selectedRecord}
        onClose={() => selectRecord(null)}
        onSendMessage={handleSendMessage}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-accent/40 bg-surface p-3 font-mono text-xs text-ink shadow-xl backdrop-blur-md">
          {toast}
        </div>
      )}
    </div>
  );
}
