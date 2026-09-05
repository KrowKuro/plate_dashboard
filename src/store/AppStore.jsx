import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getDaysUntilExpiry, isExpired } from '../lib/insuranceFormatters.js';

const SETTINGS_KEY = 'insurance_dashboard_settings_v1';
const EXPIRY_SOON_DAYS = 30;

const DEFAULT_SETTINGS = {
  density: 'comfortable',
  pageSize: 50,
  showHints: true,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const StoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ loading: true, loadingText: 'Initializing...', error: null });
  const [notice, setNotice] = useState(null);

  const [settings, setSettings] = useState(loadSettings);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all | active | expired | missing_owner
  const [selectedCompany, setSelectedCompany] = useState('all');

  const processRecords = useCallback((rawArr) => {
    return rawArr.map((r) => {
      const id = r.id || r.key || r.plateNumber || r.plate;
      // Read owner's phone if present in the JSON record (field names: ownerPhone, owner_phone, or ownerContact)
      const ownerPhoneInJson = r.ownerPhone || r.owner_phone || r.ownerContact || undefined;
      const expired = isExpired(r);
      const daysUntilExpiry = getDaysUntilExpiry(r.endDate);
      return {
        ...r,
        id,
        key: id,
        ownerPhone: ownerPhoneInJson,
        __expired: expired,
        __daysUntilExpiry: daysUntilExpiry,
        __expiringSoon: !expired && daysUntilExpiry !== null && daysUntilExpiry <= EXPIRY_SOON_DAYS
      };
    });
  }, []);

  // Initial load: Attempt auto-fetch of /output.json, fallback to 20k demo records
  useEffect(() => {
    let isMounted = true;
    async function initData() {
      setStatus({ loading: true, loadingText: 'Checking output.json in workspace...', error: null });
      try {
        const res = await fetch('/output.json');
        if (res.ok) {
          const json = await res.json();
          const rawArr = Array.isArray(json) ? json : (json.records || json.data || []);
          if (isMounted) {
            const tagged = processRecords(rawArr);
            setItems(tagged);
            setStatus({ loading: false, loadingText: '', error: null });
            setNotice({ tone: 'good', message: `Loaded ${tagged.length.toLocaleString()} records from output.json` });
            return;
          }
        }
      } catch (err) {
        console.warn('Auto-fetch /output.json failed!', err);
      }
    }

    initData();

  }, [processRecords]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSetting = useCallback((key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const loadOutputJson = useCallback(async () => {
    setStatus({ loading: true, loadingText: 'Loading output.json (80MB)...', error: null });
    try {
      const res = await fetch('/output.json');
      if (!res.ok) throw new Error(`HTTP ${res.status} - file output.json not found in public folder`);
      const json = await res.json();
      const rawArr = Array.isArray(json) ? json : (json.records || json.data || []);
      const tagged = processRecords(rawArr);
      setItems(tagged);
      setStatus({ loading: false, loadingText: '', error: null });
      setNotice({ tone: 'good', message: `Successfully inserted ${tagged.length.toLocaleString()} records from output.json!` });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setStatus({ loading: false, loadingText: '', error: null });
      setNotice({ tone: 'critical', message: `Failed to load output.json: ${errMsg}` });
    }
  }, [processRecords]);

  const uploadJsonFile = useCallback((file) => {
    setStatus({ loading: true, loadingText: `Reading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)...`, error: null });
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error('Could not read file text');
        const json = JSON.parse(text);
        const rawArr = Array.isArray(json) ? json : (json.records || json.data || []);
        const tagged = processRecords(rawArr);
        setItems(tagged);
        setStatus({ loading: false, loadingText: '', error: null });
        setNotice({ tone: 'good', message: `Uploaded and parsed ${tagged.length.toLocaleString()} records from ${file.name}` });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setStatus({ loading: false, loadingText: '', error: null });
        setNotice({ tone: 'critical', message: `Invalid JSON file: ${errMsg}` });
      }
    };
    reader.onerror = () => {
      setStatus({ loading: false, loadingText: '', error: null });
      setNotice({ tone: 'critical', message: 'File read error.' });
    };
    reader.readAsText(file);
  }, [processRecords]);

  // Unique companies list for filter dropdown
  const companiesList = useMemo(() => {
    const set = new Set();
    items.forEach((r) => {
      if (r.company) set.add(r.company.trim());
    });
    return Array.from(set).sort();
  }, [items]);

  // Compute aggregate stats for dashboard charts & cards
  const stats = useMemo(() => {
    let active = 0;
    let expired = 0;
    let expiring = 0;
    let withOwner = 0;
    let missingOwner = 0;
    const companyMap = {};
    const brandMap = {};

    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      if (r.__expired) expired++;
      else active++;

      if (r.__expiringSoon) expiring++;

      if (r.ownerPhone) withOwner++;
      else missingOwner++;

      const comp = r.company ? r.company.trim() : 'Unknown';
      companyMap[comp] = (companyMap[comp] || 0) + 1;

      const brand = r.vehicleBrand ? r.vehicleBrand.trim() : 'Other';
      brandMap[brand] = (brandMap[brand] || 0) + 1;
    }

    const total = items.length;
    const ownerCoverage = total > 0 ? Math.round((withOwner / total) * 100) : 0;

    const companyBreakdown = Object.entries(companyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const brandBreakdown = Object.entries(brandMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      active,
      expired,
      expiring,
      withOwner,
      missingOwner,
      ownerCoverage,
      companyBreakdown,
      brandBreakdown
    };
  }, [items]);

  // Filtered dataset
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items.filter((r) => {
      // Tab filter
      if (activeTab === 'expired' && !r.__expired) return false;
      if (activeTab === 'active' && r.__expired) return false;
      if (activeTab === 'expiring' && !r.__expiringSoon) return false;
      if (activeTab === 'missing_owner' && r.ownerPhone) return false;
     

      // Company dropdown filter
      if (selectedCompany !== 'all' && r.company !== selectedCompany) return false;

      // Query filter
      if (!q) return true;

      const plate = (r.plateNumber || r.plate || '').toLowerCase();
      const comp = (r.company || '').toLowerCase();
      const contract = (r.contractNumber || '').toLowerCase();
      const brand = (r.vehicleBrand || '').toLowerCase();
      const companyPhone = (r.phone || '').toLowerCase();
      const ownerP = (r.ownerPhone || '').toLowerCase();

      return (
        plate.includes(q) ||
        comp.includes(q) ||
        contract.includes(q) ||
        brand.includes(q) ||
        companyPhone.includes(q) ||
        ownerP.includes(q)
      );
    });
  }, [items, query, activeTab, selectedCompany]);

  const value = {
    items,
    filteredItems,
    stats,
    status,
    notice,
    setNotice,

    settings,
    setSetting,
    resetSettings,

    query,
    setQuery,
    activeTab,
    setActiveTab,
    selectedCompany,
    setSelectedCompany,
    companiesList,

    selectedRecord,
    selectRecord: setSelectedRecord,

    loadOutputJson,
    uploadJsonFile
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <AppStoreProvider>');
  return ctx;
}
