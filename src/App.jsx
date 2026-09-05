import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStoreProvider } from './store/AppStore.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ItemsPage from './pages/ItemsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStoreProvider>
  );
}
