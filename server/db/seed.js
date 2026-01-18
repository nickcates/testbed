import db, { run } from './index.js';

console.log('🌱 Seeding database with sample balloon operators...\n');

const sampleLeads = [
  {
    business_name: 'Sunrise Balloon Adventures',
    place_id: 'mock_place_1',
    phone_number: '(505) 555-0101',
    email: 'info@sunriseballoons.com',
    website: 'https://sunriseballoons.com',
    address: '123 Sky View Dr, Albuquerque, NM 87104',
    city: 'Albuquerque',
    state: 'NM',
    zip_code: '87104',
    latitude: 35.0844,
    longitude: -106.6504,
    google_rating: 4.8,
    total_reviews: 342,
    recent_reviews_count: 28,
    recent_rating_avg: 4.9,
    owner_name: 'Maria Rodriguez',
    booking_platform: 'FareHarbor',
    booking_platform_confidence: 'high',
    status: 'new',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Sky High Balloons',
    place_id: 'mock_place_2',
    phone_number: '(707) 555-0202',
    email: 'contact@skyhighballoons.com',
    website: 'https://skyhighballoons.com',
    address: '456 Vineyard Rd, Napa, CA 94558',
    city: 'Napa',
    state: 'CA',
    zip_code: '94558',
    latitude: 38.2975,
    longitude: -122.2869,
    google_rating: 4.9,
    total_reviews: 567,
    recent_reviews_count: 45,
    recent_rating_avg: 5.0,
    owner_name: 'James Chen',
    booking_platform: 'Peek Pro',
    booking_platform_confidence: 'high',
    status: 'contacted',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Desert Winds Ballooning',
    place_id: 'mock_place_3',
    phone_number: '(602) 555-0303',
    email: null,
    website: 'https://desertwindsballoons.com',
    address: '789 Desert Vista Pkwy, Phoenix, AZ 85004',
    city: 'Phoenix',
    state: 'AZ',
    zip_code: '85004',
    latitude: 33.4484,
    longitude: -112.0740,
    google_rating: 4.6,
    total_reviews: 234,
    recent_reviews_count: 15,
    recent_rating_avg: 4.7,
    owner_name: 'Sarah Johnson',
    booking_platform: 'Rezdy',
    booking_platform_confidence: 'high',
    status: 'new',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Mile High Balloon Company',
    place_id: 'mock_place_4',
    phone_number: '(303) 555-0404',
    email: 'fly@milehighballoons.com',
    website: 'https://milehighballoons.com',
    address: '321 Mountain View Ln, Boulder, CO 80301',
    city: 'Boulder',
    state: 'CO',
    zip_code: '80301',
    latitude: 40.0150,
    longitude: -105.2705,
    google_rating: 4.7,
    total_reviews: 189,
    recent_reviews_count: 22,
    recent_rating_avg: 4.8,
    owner_name: null,
    booking_platform: 'Bookeo',
    booking_platform_confidence: 'high',
    status: 'qualified',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Smoky Mountain Balloons',
    place_id: 'mock_place_5',
    phone_number: '(865) 555-0505',
    email: 'info@smokymountainballoons.com',
    website: null,
    address: '654 Park Rd, Gatlinburg, TN 37738',
    city: 'Gatlinburg',
    state: 'TN',
    zip_code: '37738',
    latitude: 35.7143,
    longitude: -83.5102,
    google_rating: 4.5,
    total_reviews: 156,
    recent_reviews_count: 8,
    recent_rating_avg: 4.4,
    owner_name: 'Robert Williams',
    booking_platform: 'Unknown',
    booking_platform_confidence: 'low',
    status: 'new',
    enriched: 0,
    data_source: 'google_places'
  },
  {
    business_name: 'Hudson Valley Hot Air Balloons',
    place_id: 'mock_place_6',
    phone_number: '(845) 555-0606',
    email: 'reservations@hudsonvalleyballoons.com',
    website: 'https://hudsonvalleyballoons.com',
    address: '987 River Rd, Poughkeepsie, NY 12601',
    city: 'Poughkeepsie',
    state: 'NY',
    zip_code: '12601',
    latitude: 41.7004,
    longitude: -73.9209,
    google_rating: 4.9,
    total_reviews: 423,
    recent_reviews_count: 38,
    recent_rating_avg: 4.9,
    owner_name: 'Emily Patterson',
    booking_platform: 'FareHarbor',
    booking_platform_confidence: 'high',
    status: 'contacted',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Texas Sky Riders',
    place_id: 'mock_place_7',
    phone_number: '(512) 555-0707',
    email: 'hello@texasskyriders.com',
    website: 'https://texassyriders.com',
    address: '147 Hill Country Dr, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    zip_code: '78701',
    latitude: 30.2672,
    longitude: -97.7431,
    google_rating: 4.4,
    total_reviews: 98,
    recent_reviews_count: 5,
    recent_rating_avg: 4.2,
    owner_name: null,
    booking_platform: 'Custom/Built-in',
    booking_platform_confidence: 'medium',
    status: 'new',
    enriched: 1,
    data_source: 'google_places'
  },
  {
    business_name: 'Pacific Northwest Balloon Adventures',
    place_id: 'mock_place_8',
    phone_number: '(503) 555-0808',
    email: 'adventures@pnwballoons.com',
    website: 'https://pnwballoons.com',
    address: '258 Columbia River Hwy, Portland, OR 97201',
    city: 'Portland',
    state: 'OR',
    zip_code: '97201',
    latitude: 45.5152,
    longitude: -122.6784,
    google_rating: 4.7,
    total_reviews: 276,
    recent_reviews_count: 19,
    recent_rating_avg: 4.8,
    owner_name: 'David Martinez',
    booking_platform: 'Peek Pro',
    booking_platform_confidence: 'high',
    status: 'new',
    enriched: 1,
    data_source: 'google_places'
  }
];

// Insert leads
for (const lead of sampleLeads) {
  const result = run(`
    INSERT INTO leads (
      business_name, place_id, phone_number, email, website,
      address, city, state, zip_code, latitude, longitude,
      google_rating, total_reviews, recent_reviews_count, recent_rating_avg,
      owner_name, booking_platform, booking_platform_confidence,
      status, enriched, data_source, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `, [
    lead.business_name, lead.place_id, lead.phone_number, lead.email, lead.website,
    lead.address, lead.city, lead.state, lead.zip_code, lead.latitude, lead.longitude,
    lead.google_rating, lead.total_reviews, lead.recent_reviews_count, lead.recent_rating_avg,
    lead.owner_name, lead.booking_platform, lead.booking_platform_confidence,
    lead.status, lead.enriched, lead.data_source
  ]);

  console.log(`✓ Added: ${lead.business_name} (${lead.city}, ${lead.state})`);
}

// Calculate lead scores and ranks
import { rankLeads, calculateLeadScore } from '../services/ranking.js';
import { query } from './index.js';

console.log('\n📊 Calculating lead scores and rankings...');

const allLeads = query('SELECT * FROM leads');
const ranked = rankLeads(allLeads);

for (const lead of ranked) {
  run('UPDATE leads SET lead_score = ?, lead_rank = ? WHERE id = ?', [
    lead.lead_score,
    lead.lead_rank,
    lead.id
  ]);
}

console.log('\n✅ Database seeded successfully!');
console.log(`   ${sampleLeads.length} balloon operators added`);
console.log(`   Scores calculated and ranked\n`);

db.close();
