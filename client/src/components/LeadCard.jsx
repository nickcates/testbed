import { MapPin, Phone, Mail, Globe, Award, MessageSquare, ExternalLink } from 'lucide-react';

export default function LeadCard({ lead, onClick }) {
  const getTierBadge = (score) => {
    if (score >= 80) return { label: 'A+', color: 'badge-green' };
    if (score >= 65) return { label: 'A', color: 'badge-blue' };
    if (score >= 50) return { label: 'B', color: 'badge-yellow' };
    if (score >= 35) return { label: 'C', color: 'badge-yellow' };
    return { label: 'D', color: 'badge-red' };
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: 'badge-blue',
      contacted: 'badge-yellow',
      qualified: 'badge-green',
      not_interested: 'badge-gray'
    };
    return colors[status] || 'badge-gray';
  };

  const tier = getTierBadge(lead.lead_score || 0);

  return (
    <div
      onClick={onClick}
      className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {lead.business_name}
                </h3>
                <span className="text-sm text-gray-500">#{lead.lead_rank || '—'}</span>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <span className={`badge ${tier.color}`}>
                  {tier.label} Tier • Score: {lead.lead_score || 0}
                </span>
                <span className={`badge ${getStatusBadge(lead.status)}`}>
                  {lead.status || 'new'}
                </span>
                {lead.enriched && (
                  <span className="badge badge-green">✓ Enriched</span>
                )}
              </div>

              {lead.address && (
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{lead.city}, {lead.state}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-sm font-medium">
                  {lead.google_rating ? `${lead.google_rating} ⭐` : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Reviews</p>
                <p className="text-sm font-medium">{lead.total_reviews || 0}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Recent (90d)</p>
                <p className="text-sm font-medium">{lead.recent_reviews_count || 0}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Booking Platform</p>
              <p className="text-sm font-medium">
                {lead.booking_platform || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4 text-sm">
            {lead.phone_number && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{lead.phone_number}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{lead.email}</span>
              </div>
            )}
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {lead.owner_name && (
            <div className="mt-3 text-sm text-gray-600">
              <span className="font-medium">Owner:</span> {lead.owner_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
