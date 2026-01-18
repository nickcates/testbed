import { Balloon, Download, Sparkles } from 'lucide-react';

export default function Header({ onImport, onEnrichAll, leadsCount }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-lg">
              <Balloon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Balloon CRM</h1>
              <p className="text-sm text-gray-500">
                Hot Air Balloon Operators • {leadsCount} leads
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onEnrichAll}
              className="btn-secondary flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enrich All</span>
            </button>
            <button
              onClick={onImport}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Import Leads</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
