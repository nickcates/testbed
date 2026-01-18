/**
 * Calculate lead score based on multiple factors
 *
 * Scoring criteria:
 * - Total reviews: Higher is better (0-30 points)
 * - Recent reviews count (last 90 days): More activity is better (0-25 points)
 * - Overall rating: Higher is better (0-20 points)
 * - Recent rating average: Recent quality matters (0-15 points)
 * - Has booking platform: Shows investment in infrastructure (0-10 points)
 *
 * Total possible: 100 points
 */
export function calculateLeadScore(lead) {
    let score = 0;

    // 1. Total reviews score (0-30 points)
    // More reviews = more established business
    const reviewsScore = Math.min(30, (lead.total_reviews / 500) * 30);
    score += Math.round(reviewsScore);

    // 2. Recent reviews count (0-25 points)
    // Recent activity indicates active, growing business
    const recentScore = Math.min(25, (lead.recent_reviews_count / 50) * 25);
    score += Math.round(recentScore);

    // 3. Overall rating (0-20 points)
    // High rating = quality service
    if (lead.google_rating) {
        const ratingScore = ((lead.google_rating - 3) / 2) * 20; // 3.0 = 0 pts, 5.0 = 20 pts
        score += Math.max(0, Math.round(ratingScore));
    }

    // 4. Recent rating average (0-15 points)
    // Recent quality can differ from overall
    if (lead.recent_rating_avg) {
        const recentRatingScore = ((lead.recent_rating_avg - 3) / 2) * 15;
        score += Math.max(0, Math.round(recentRatingScore));
    }

    // 5. Booking platform (0-10 points)
    // Having a professional booking system shows investment
    if (lead.booking_platform && lead.booking_platform !== 'Unknown') {
        const confidenceMultiplier = {
            'high': 1.0,
            'medium': 0.7,
            'low': 0.4
        };
        const multiplier = confidenceMultiplier[lead.booking_platform_confidence] || 0.5;
        score += Math.round(10 * multiplier);
    }

    return Math.min(100, score);
}

/**
 * Rank all leads by their score
 * Returns array of lead IDs in rank order
 */
export function rankLeads(leads) {
    // Calculate score for each lead
    const scored = leads.map(lead => ({
        ...lead,
        lead_score: calculateLeadScore(lead)
    }));

    // Sort by score (highest first)
    scored.sort((a, b) => {
        // Primary sort: lead score
        if (b.lead_score !== a.lead_score) {
            return b.lead_score - a.lead_score;
        }
        // Secondary sort: total reviews
        if (b.total_reviews !== a.total_reviews) {
            return b.total_reviews - a.total_reviews;
        }
        // Tertiary sort: rating
        return (b.google_rating || 0) - (a.google_rating || 0);
    });

    // Assign ranks
    scored.forEach((lead, index) => {
        lead.lead_rank = index + 1;
    });

    return scored;
}

/**
 * Get quality tier based on lead score
 */
export function getLeadTier(score) {
    if (score >= 80) return 'A+ (Hot Lead)';
    if (score >= 65) return 'A (High Quality)';
    if (score >= 50) return 'B (Good)';
    if (score >= 35) return 'C (Average)';
    if (score >= 20) return 'D (Below Average)';
    return 'F (Poor)';
}

export default {
    calculateLeadScore,
    rankLeads,
    getLeadTier
};
