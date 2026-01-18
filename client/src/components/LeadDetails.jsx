import { useState, useEffect } from 'react';
import { X, Sparkles, Save, ExternalLink } from 'lucide-react';
import { fetchLead, enrichLead, updateLeadStatus, updateLeadNotes } from '../services/api';

export default function LeadDetails({ lead, onClose, onUpdate }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadDetails();
  }, [lead.id]);

  const loadDetails = async () => {
    try {
      const data = await fetchLead(lead.id);
      setDetails(data);
      setNotes(data.notes || '');
      setStatus(data.status || 'new');
    } catch (error) {
      console.error('Error loading lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrich = async () => {
    try {
      setEnriching(true);
      await enrichLead(lead.id);
      await loadDetails();
      onUpdate();
    } catch (error) {
      console.error('Error enriching lead:', error);
      alert('Failed to enrich lead');
    } finally {
      setEnriching(false);
    }
  };

  const handleSaveStatus = async () => {
    try {
      await updateLeadStatus(lead.id, status);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updateLeadNotes(lead.id, notes);
      onUpdate();
      alert('Notes saved!');
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    }
  };

  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{details.business_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEnrich}
              disabled={enriching}
              className="btn-primary flex items-center space-x-2"
            >
              <Sparkles className={`w-4 h-4 ${enriching ? 'animate-spin' : ''}`} />
              <span>{enriching ? 'Enriching...' : 'Enrich Lead'}</span>
            </button>
            {details.website && (
              <a
                href={details.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Website</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Owner</dt>
                  <dd className="text-gray-900 font-medium">{details.owner_name || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="text-gray-900 font-medium">{details.phone_number || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="text-gray-900 font-medium">{details.email || '—'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd className="text-gray-900 font-medium">{details.address || '—'}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Metrics</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Lead Score</dt>
                  <dd className="text-gray-900 font-medium text-lg">{details.lead_score || 0} / 100</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Google Rating</dt>
                  <dd className="text-gray-900 font-medium">{details.google_rating || '—'} ⭐</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Total Reviews</dt>
                  <dd className="text-gray-900 font-medium">{details.total_reviews || 0}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Recent Reviews (90d)</dt>
                  <dd className="text-gray-900 font-medium">
                    {details.recent_reviews_count || 0} ({details.recent_rating_avg || '—'} avg)
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Booking Platform</dt>
                  <dd className="text-gray-900 font-medium">
                    {details.booking_platform || 'Unknown'}
                    {details.booking_platform_confidence && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({details.booking_platform_confidence})
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
            <div className="flex items-center space-x-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="not_interested">Not Interested</option>
              </select>
              <button onClick={handleSaveStatus} className="btn-secondary">
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="4"
              placeholder="Add notes about this lead..."
            />
            <button onClick={handleSaveNotes} className="btn-primary mt-2">
              Save Notes
            </button>
          </div>

          {details.reviews && details.reviews.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Recent Reviews ({details.reviews.length})
              </h3>
              <div className="space-y-3">
                {details.reviews.slice(0, 5).map((review, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{review.author_name}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                    <p className="text-xs text-gray-400 mt-2">{review.relative_time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
