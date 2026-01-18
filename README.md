# 🎈 Balloon CRM

A comprehensive CRM application for tracking and managing hot air ballooning operators across the United States. The system automatically gathers operator data from Google Places, ranks leads based on reviews and activity, and enriches each lead with booking platform information and contact details.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![Tech Stack](https://img.shields.io/badge/Express-4.22-green)
![Tech Stack](https://img.shields.io/badge/Tailwind-3.4-cyan)
![Tech Stack](https://img.shields.io/badge/SQLite-3-lightgrey)

## ✨ Features

### Lead Management
- **Automated Import**: Gather hot air balloon operators from Google Places API
- **Smart Ranking**: Rank leads based on:
  - Total Google reviews
  - Recent reviews (last 90 days)
  - Overall rating
  - Recent rating average
  - Booking platform infrastructure
- **Comprehensive Data**: For each operator:
  - Business name and location
  - Owner name
  - Phone number
  - Email address
  - Website
  - Booking platform detection
  - Google reviews and ratings

### Data Enrichment
- **Booking Platform Detection**: Automatically identifies platforms like:
  - FareHarbor, Peek Pro, Rezdy, Bookeo
  - Checkfront, Xola, Bokun, Regiondo
  - Shopify, WooCommerce, Squarespace
  - Custom/built-in solutions
- **Contact Extraction**: Web scraping to find:
  - Owner/founder names
  - Email addresses
  - Phone numbers
- **Review Analysis**: Calculates recent review metrics for better lead qualification

### Lead Scoring System
Leads are scored 0-100 based on:
- **Total Reviews** (0-30 points): More reviews = more established business
- **Recent Activity** (0-25 points): Recent reviews indicate growth
- **Overall Rating** (0-20 points): Quality of service
- **Recent Rating** (0-15 points): Current customer satisfaction
- **Booking Platform** (0-10 points): Professional infrastructure investment

**Tier System:**
- A+ (80-100): Hot leads - High volume, high quality
- A (65-79): High quality leads
- B (50-64): Good leads
- C (35-49): Average leads
- D (20-34): Below average leads
- F (0-19): Poor leads

### UI Features
- Modern Tailwind CSS interface
- Real-time filtering by status, state, and score
- Detailed lead view with reviews
- Status tracking (New, Contacted, Qualified, Not Interested)
- Notes and CRM functionality
- One-click enrichment

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- (Optional) Google Places API key for real data

### Installation

1. **Clone and install dependencies:**
```bash
npm install
cd client && npm install && cd ..
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Google Places API key (optional):
```env
GOOGLE_PLACES_API_KEY=your_api_key_here
```

**Note:** Without an API key, the app will use mock data automatically.

3. **Initialize the database:**
```bash
node server/db/migrate.js
```

4. **Start the application:**
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3001
- Frontend React app on http://localhost:3000

### Import Your First Leads

1. Click "Import Leads" in the header
2. Select a state or choose "All States"
3. Set max results (default: 50)
4. Click "Import Leads"

The system will:
- Search Google Places for balloon operators
- Import business details and reviews
- Calculate initial lead scores and rankings

### Enrich Lead Data

**Single Lead:**
1. Click on any lead card to open details
2. Click "Enrich Lead"
3. System will detect booking platform and extract contact info

**All Leads:**
1. Click "Enrich All" in the header
2. System will process all unenriched leads with websites

## 📁 Project Structure

```
balloon-crm/
├── server/                 # Backend Express API
│   ├── db/
│   │   ├── schema.sql     # Database schema
│   │   ├── migrate.js     # Migration script
│   │   └── index.js       # Database helper functions
│   ├── routes/
│   │   └── leads.js       # Lead management API routes
│   ├── services/
│   │   ├── googlePlaces.js    # Google Places API integration
│   │   ├── enrichment.js      # Data enrichment (booking, contact)
│   │   └── ranking.js         # Lead scoring & ranking algorithm
│   └── index.js           # Express server
│
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── LeadCard.jsx
│   │   │   ├── LeadDetails.jsx
│   │   │   └── ImportDialog.jsx
│   │   ├── services/
│   │   │   └── api.js     # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json           # Backend dependencies
├── .env                   # Environment variables
└── README.md
```

## 🔌 API Endpoints

### Leads

- `GET /api/leads` - Get all leads with filters
  - Query params: `status`, `state`, `minScore`
- `GET /api/leads/:id` - Get single lead with reviews
- `POST /api/leads/import` - Import leads from Google Places
  - Body: `{ state, maxResults }`
- `POST /api/leads/:id/enrich` - Enrich single lead
- `POST /api/leads/enrich-all` - Batch enrich all leads
- `PATCH /api/leads/:id/status` - Update lead status
  - Body: `{ status }`
- `PATCH /api/leads/:id/notes` - Update lead notes
  - Body: `{ notes }`

### Health Check

- `GET /api/health` - Server health check

## 🎯 Use Cases

### Sales Team
1. Import leads for target states
2. Filter by A+ tier (score 80+) for hot leads
3. Track contact status (new → contacted → qualified)
4. Add notes during qualification calls

### Market Research
1. Analyze booking platform adoption across regions
2. Compare review counts and ratings by state
3. Identify underserved markets (low competition)

### Business Development
1. Find high-quality operators for partnerships
2. Track recent review trends
3. Identify operators without professional booking systems

## 🛠️ Technology Stack

**Backend:**
- Express.js - REST API
- Better-SQLite3 - Fast, embedded database
- Axios - HTTP client
- Cheerio - Web scraping
- dotenv - Environment management

**Frontend:**
- React 18 - UI framework
- Vite - Build tool & dev server
- Tailwind CSS - Utility-first styling
- Lucide React - Icon library
- Axios - API client

**Database:**
- SQLite3 - Embedded SQL database
- Schema includes: leads, reviews, enrichment_log

## 📊 Database Schema

### Leads Table
Stores all balloon operator information:
- Business details (name, location, contact)
- Google metrics (rating, reviews)
- Enriched data (owner, booking platform)
- Lead scoring (score, rank, tier)
- CRM status and notes

### Reviews Table
Stores Google reviews for analysis:
- Author, rating, text, timestamp
- Linked to leads for detailed view

### Enrichment Log
Tracks all enrichment operations:
- Type (booking_platform, contact_info)
- Status (success, failed, partial)
- Details and timestamp

## 🔐 Security & Privacy

- No user authentication (internal tool)
- API calls respect rate limits
- Web scraping is polite (delays between requests)
- No data sharing with third parties
- SQLite database stored locally

## 🚧 Limitations

**Without Google API Key:**
- Uses mock data (8 sample companies)
- Cannot import real operators
- Reviews and details are simulated

**With Google API Key:**
- Subject to Google Places API quotas
- Some contact info may not be publicly available
- Booking platform detection depends on website structure

## 🔄 Future Enhancements

- [ ] Export leads to CSV
- [ ] Email campaign integration
- [ ] Advanced search with full-text
- [ ] Bulk status updates
- [ ] Analytics dashboard
- [ ] Automated lead scoring updates
- [ ] Integration with CRM platforms (Salesforce, HubSpot)
- [ ] Multi-user support with authentication

## 📝 Development

### Running Tests
```bash
# Backend
npm test

# Frontend
cd client && npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Database Commands
```bash
# Run migrations
node server/db/migrate.js

# View database
sqlite3 server/db/balloon_crm.db
```

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💡 Tips

1. **Get a Google API Key**: For real data, enable the Places API in Google Cloud Console
2. **Start Small**: Import 10-20 leads first to test the system
3. **Enrich Gradually**: Enrichment makes HTTP requests, so process in batches
4. **Filter Effectively**: Use the tier filters to focus on high-quality leads
5. **Track Everything**: Use the notes field to record conversations and outcomes

## 📞 Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ for the hot air balloon industry**
