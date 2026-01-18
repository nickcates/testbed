import { useState } from 'react';
import { X, Download } from 'lucide-react';

export default function ImportDialog({ onClose, onImport }) {
  const [state, setState] = useState('all');
  const [maxResults, setMaxResults] = useState(50);
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    try {
      setImporting(true);
      await onImport({ state, maxResults });
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Import Leads</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All States</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="AZ">Arizona</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="OR">Oregon</option>
              <option value="WA">Washington</option>
              <option value="NV">Nevada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Results
            </label>
            <input
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
              min="1"
              max="200"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Without a Google API key, this will use mock data
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This will search Google Places for hot air balloon operators
              and import their information including ratings, reviews, and contact details.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Download className={`w-4 h-4 ${importing ? 'animate-bounce' : ''}`} />
              <span>{importing ? 'Importing...' : 'Import Leads'}</span>
            </button>
            <button
              onClick={onClose}
              disabled={importing}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
