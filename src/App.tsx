import { useState } from "react";
import { CustomerView } from "./components/CustomerView";
import { AdminPortal } from "./components/AdminPortal";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  // Secret key combination to access admin (Ctrl+Shift+A)
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  if (showAdmin) {
    return <AdminPortal onClose={() => setShowAdmin(false)} />;
  }

  return <CustomerView />;
}
