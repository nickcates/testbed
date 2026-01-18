import { useState } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import LeadCard from './LeadCard';
import LeadDetails from './LeadDetails';
import Stats from './Stats';

export default function Dashboard({ leads, loading, filters, onFilterChange, onRefresh }) {
  const [selectedLead, setSelectedLead] = useState(null);

  const stats = {
    total: leads.length,
    avgScore: leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / leads.length)
      : 0,
    topRated: leads.filter(l => l.google_rating >= 4.5).length,
    enriched: leads.filter(l => l.enriched).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Stats stats={stats} />

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Leads</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              className="btn-secondary flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="not_interested">Not Interested</option>
            </select>

            <select
              value={filters.state}
              onChange={(e) => onFilterChange({ ...filters, state: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All States</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="AZ">Arizona</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="OR">Oregon</option>
            </select>

            <select
              value={filters.minScore}
              onChange={(e) => onFilterChange({ ...filters, minScore: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Scores</option>
              <option value="80">A+ Tier (80+)</option>
              <option value="65">A Tier (65+)</option>
              <option value="50">B Tier (50+)</option>
              <option value="35">C Tier (35+)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
            <p className="mt-2 text-gray-500">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">No leads found. Import some leads to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadDetails
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={onRefresh}
        />
      )}
    </div>
  );
}
