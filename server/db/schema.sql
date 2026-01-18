-- Hot Air Balloon Operators CRM Database Schema

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    place_id TEXT UNIQUE,

    -- Contact Information
    owner_name TEXT,
    phone_number TEXT,
    email TEXT,
    website TEXT,

    -- Location
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,

    -- Reviews & Ranking
    google_rating REAL,
    total_reviews INTEGER DEFAULT 0,
    recent_reviews_count INTEGER DEFAULT 0,
    recent_rating_avg REAL,

    -- Booking Platform
    booking_platform TEXT,
    booking_platform_confidence TEXT, -- 'high', 'medium', 'low'

    -- Lead Scoring
    lead_score INTEGER DEFAULT 0,
    lead_rank INTEGER,

    -- Status
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'not_interested'

    -- Metadata
    data_source TEXT DEFAULT 'google_places',
    enriched BOOLEAN DEFAULT 0,
    last_enriched_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- Notes
    notes TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    author_name TEXT,
    rating INTEGER,
    text TEXT,
    time INTEGER,
    relative_time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS enrichment_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL,
    enrichment_type TEXT, -- 'booking_platform', 'contact_info', 'reviews'
    status TEXT, -- 'success', 'failed', 'partial'
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_state ON leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_place_id ON leads(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_lead_id ON reviews(lead_id);
CREATE INDEX IF NOT EXISTS idx_reviews_time ON reviews(time DESC);
