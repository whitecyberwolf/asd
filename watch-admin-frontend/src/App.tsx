// src/App.tsx

import  { useState } from 'react';
import { AdminWatchManager } from './components/AdminWatchManager';
import AdminChainManager    from './components/AdminChainManager';

function App() {
  const [section, setSection] = useState<'watches'|'chains'>('watches');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Section Toggle */}
      <div className="bg-white px-6 py-4 flex space-x-4 shadow">
        <button
          onClick={() => setSection('watches')}
          className={`px-4 py-2 rounded ${
            section === 'watches'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Manage Watches
        </button>
        <button
          onClick={() => setSection('chains')}
          className={`px-4 py-2 rounded ${
            section === 'chains'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Manage Chains
        </button>
      </div>

      {/* Active Panel */}
      <div className="p-6">
        {section === 'watches' ? (
          <AdminWatchManager />
        ) : (
          <AdminChainManager />
        )}
      </div>
    </div>
  );
}

export default App;
