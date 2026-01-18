import express from 'express';
import { query, queryOne, run } from '../db/index.js';
import { searchBalloonOperators, getPlaceDetails } from '../services/googlePlaces.js';
import { detectBookingPlatform, extractContactInfo, calculateRecentReviews } from '../services/enrichment.js';
import { rankLeads, calculateLeadScore } from '../services/ranking.js';

const router = express.Router();

// Get all leads with ranking
router.get('/', async (req, res) => {
    try {
        const { status, state, minScore } = req.query;

        let sql = 'SELECT * FROM leads WHERE 1=1';
        const params = [];

        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }

        if (state) {
            sql += ' AND state = ?';
            params.push(state);
        }

        if (minScore) {
            sql += ' AND lead_score >= ?';
            params.push(parseInt(minScore));
        }

        sql += ' ORDER BY lead_rank ASC, lead_score DESC';

        const leads = query(sql, params);
        res.json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// Get single lead by ID
router.get('/:id', async (req, res) => {
    try {
        const lead = queryOne('SELECT * FROM leads WHERE id = ?', [req.params.id]);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Get reviews for this lead
        const reviews = query('SELECT * FROM reviews WHERE lead_id = ? ORDER BY time DESC', [req.params.id]);

        res.json({ ...lead, reviews });
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ error: 'Failed to fetch lead' });
    }
});

// Import leads from Google Places
router.post('/import', async (req, res) => {
    try {
        const { state = 'all', maxResults = 50 } = req.body;

        console.log(`🔍 Searching for balloon operators in ${state}...`);
        const places = await searchBalloonOperators(state, maxResults);

        console.log(`📥 Found ${places.length} operators. Processing...`);
        let imported = 0;
        let updated = 0;

        for (const place of places) {
            // Check if already exists
            const existing = queryOne('SELECT id FROM leads WHERE place_id = ?', [place.place_id]);

            if (existing) {
                updated++;
                continue;
            }

            // Get detailed information
            console.log(`  Processing: ${place.name}`);
            const details = await getPlaceDetails(place.place_id);

            if (!details) continue;

            // Parse address components
            const addressComponents = details.address_components || [];
            const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
            const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
            const zipCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';

            // Calculate recent reviews metrics
            const recentMetrics = calculateRecentReviews(details.reviews || []);

            // Insert lead
            const result = run(`
                INSERT INTO leads (
                    business_name, place_id, phone_number, email, website,
                    address, city, state, zip_code, latitude, longitude,
                    google_rating, total_reviews, recent_reviews_count, recent_rating_avg,
                    data_source, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
            `, [
                details.name,
                place.place_id,
                details.formatted_phone_number || null,
                null, // email will be enriched later
                details.website || null,
                details.formatted_address || '',
                city,
                state,
                zipCode,
                details.geometry?.location?.lat || null,
                details.geometry?.location?.lng || null,
                details.rating || 0,
                details.user_ratings_total || 0,
                recentMetrics.recent_reviews_count,
                recentMetrics.recent_rating_avg,
                'google_places'
            ]);

            const leadId = result.lastInsertRowid;

            // Store reviews
            if (details.reviews && details.reviews.length > 0) {
                for (const review of details.reviews) {
                    run(`
                        INSERT INTO reviews (lead_id, author_name, rating, text, time, relative_time)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        leadId,
                        review.author_name,
                        review.rating,
                        review.text,
                        review.time,
                        review.relative_time_description
                    ]);
                }
            }

            imported++;
        }

        // Recalculate rankings
        await recalculateRankings();

        console.log(`✅ Import complete: ${imported} new, ${updated} existing`);

        res.json({
            success: true,
            imported,
            updated,
            total: places.length
        });
    } catch (error) {
        console.error('Error importing leads:', error);
        res.status(500).json({ error: 'Failed to import leads' });
    }
});

// Enrich a single lead
router.post('/:id/enrich', async (req, res) => {
    try {
        const lead = queryOne('SELECT * FROM leads WHERE id = ?', [req.params.id]);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        console.log(`🔍 Enriching: ${lead.business_name}`);

        const enrichmentData = {};

        // Detect booking platform
        if (lead.website) {
            console.log('  - Detecting booking platform...');
            const bookingInfo = await detectBookingPlatform(lead.website);
            enrichmentData.booking_platform = bookingInfo.platform;
            enrichmentData.booking_platform_confidence = bookingInfo.confidence;

            run(`
                INSERT INTO enrichment_log (lead_id, enrichment_type, status, details)
                VALUES (?, 'booking_platform', 'success', ?)
            `, [lead.id, JSON.stringify(bookingInfo)]);
        }

        // Extract contact information
        if (lead.website) {
            console.log('  - Extracting contact info...');
            const contactInfo = await extractContactInfo(lead.website);

            if (contactInfo.owner_name) enrichmentData.owner_name = contactInfo.owner_name;
            if (contactInfo.email) enrichmentData.email = contactInfo.email;
            if (contactInfo.phone_number && !lead.phone_number) {
                enrichmentData.phone_number = contactInfo.phone_number;
            }

            run(`
                INSERT INTO enrichment_log (lead_id, enrichment_type, status, details)
                VALUES (?, 'contact_info', 'success', ?)
            `, [lead.id, JSON.stringify(contactInfo)]);
        }

        // Update lead
        const updates = Object.keys(enrichmentData);
        if (updates.length > 0) {
            const setClause = updates.map(key => `${key} = ?`).join(', ');
            const values = updates.map(key => enrichmentData[key]);

            run(`
                UPDATE leads
                SET ${setClause}, enriched = 1, last_enriched_at = datetime('now'), updated_at = datetime('now')
                WHERE id = ?
            `, [...values, lead.id]);
        }

        // Recalculate score
        const updatedLead = queryOne('SELECT * FROM leads WHERE id = ?', [lead.id]);
        const newScore = calculateLeadScore(updatedLead);
        run('UPDATE leads SET lead_score = ? WHERE id = ?', [newScore, lead.id]);

        // Recalculate rankings
        await recalculateRankings();

        console.log(`✅ Enrichment complete`);

        res.json({
            success: true,
            enriched: enrichmentData
        });
    } catch (error) {
        console.error('Error enriching lead:', error);
        res.status(500).json({ error: 'Failed to enrich lead' });
    }
});

// Enrich all leads
router.post('/enrich-all', async (req, res) => {
    try {
        const leads = query('SELECT * FROM leads WHERE enriched = 0 AND website IS NOT NULL');

        console.log(`🔍 Enriching ${leads.length} leads...`);
        let enriched = 0;

        for (const lead of leads) {
            try {
                const enrichmentData = {};

                // Detect booking platform
                const bookingInfo = await detectBookingPlatform(lead.website);
                enrichmentData.booking_platform = bookingInfo.platform;
                enrichmentData.booking_platform_confidence = bookingInfo.confidence;

                // Extract contact information
                const contactInfo = await extractContactInfo(lead.website);
                if (contactInfo.owner_name) enrichmentData.owner_name = contactInfo.owner_name;
                if (contactInfo.email) enrichmentData.email = contactInfo.email;
                if (contactInfo.phone_number && !lead.phone_number) {
                    enrichmentData.phone_number = contactInfo.phone_number;
                }

                // Update lead
                const updates = Object.keys(enrichmentData);
                if (updates.length > 0) {
                    const setClause = updates.map(key => `${key} = ?`).join(', ');
                    const values = updates.map(key => enrichmentData[key]);

                    run(`
                        UPDATE leads
                        SET ${setClause}, enriched = 1, last_enriched_at = datetime('now'), updated_at = datetime('now')
                        WHERE id = ?
                    `, [...values, lead.id]);

                    enriched++;
                }

                // Small delay to be respectful
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`  Error enriching ${lead.business_name}:`, error.message);
            }
        }

        // Recalculate rankings
        await recalculateRankings();

        console.log(`✅ Batch enrichment complete: ${enriched} leads enriched`);

        res.json({
            success: true,
            enriched,
            total: leads.length
        });
    } catch (error) {
        console.error('Error in batch enrichment:', error);
        res.status(500).json({ error: 'Failed to enrich leads' });
    }
});

// Update lead status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'contacted', 'qualified', 'not_interested'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        run('UPDATE leads SET status = ?, updated_at = datetime(\'now\') WHERE id = ?', [status, req.params.id]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating lead status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Add notes to lead
router.patch('/:id/notes', async (req, res) => {
    try {
        const { notes } = req.body;

        run('UPDATE leads SET notes = ?, updated_at = datetime(\'now\') WHERE id = ?', [notes, req.params.id]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating notes:', error);
        res.status(500).json({ error: 'Failed to update notes' });
    }
});

// Helper function to recalculate all rankings
async function recalculateRankings() {
    const allLeads = query('SELECT * FROM leads');
    const ranked = rankLeads(allLeads);

    for (const lead of ranked) {
        run('UPDATE leads SET lead_score = ?, lead_rank = ? WHERE id = ?', [
            lead.lead_score,
            lead.lead_rank,
            lead.id
        ]);
    }
}

export default router;
