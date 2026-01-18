import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Detect booking platform from website
 */
export async function detectBookingPlatform(websiteUrl) {
    if (!websiteUrl) {
        return { platform: 'Unknown', confidence: 'low' };
    }

    try {
        const response = await axios.get(websiteUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Check for common booking platforms
        const platforms = {
            'FareHarbor': {
                indicators: ['fareharbor', 'fhbooking'],
                confidence: 'high'
            },
            'Peek Pro': {
                indicators: ['peek.com', 'peek-book', 'peekpro'],
                confidence: 'high'
            },
            'Rezdy': {
                indicators: ['rezdy.com', 'rezdy-book'],
                confidence: 'high'
            },
            'Bookeo': {
                indicators: ['bookeo.com', 'bookeo-widget'],
                confidence: 'high'
            },
            'Checkfront': {
                indicators: ['checkfront.com', 'checkfront-widget'],
                confidence: 'high'
            },
            'Xola': {
                indicators: ['xola.com', 'xola-checkout'],
                confidence: 'high'
            },
            'Bokun': {
                indicators: ['bokun.io', 'widgets.bokun'],
                confidence: 'high'
            },
            'Regiondo': {
                indicators: ['regiondo.com', 'regiondo-widget'],
                confidence: 'high'
            },
            'Shopify': {
                indicators: ['shopify.com', 'cdn.shopify'],
                confidence: 'medium'
            },
            'WordPress/WooCommerce': {
                indicators: ['wp-content', 'woocommerce'],
                confidence: 'medium'
            },
            'Squarespace': {
                indicators: ['squarespace.com', 'static.squarespace'],
                confidence: 'medium'
            },
            'Custom/Built-in': {
                indicators: ['book now', 'reserve', 'booking'],
                confidence: 'low'
            }
        };

        const htmlLower = html.toLowerCase();

        for (const [platform, config] of Object.entries(platforms)) {
            for (const indicator of config.indicators) {
                if (htmlLower.includes(indicator.toLowerCase())) {
                    return {
                        platform,
                        confidence: config.confidence
                    };
                }
            }
        }

        // Check for generic booking buttons
        const bookingButtons = $('a, button').filter((i, el) => {
            const text = $(el).text().toLowerCase();
            const href = $(el).attr('href')?.toLowerCase() || '';
            return text.includes('book') || text.includes('reserve') ||
                   href.includes('book') || href.includes('reserve');
        });

        if (bookingButtons.length > 0) {
            return {
                platform: 'Custom/Built-in',
                confidence: 'medium'
            };
        }

        return {
            platform: 'Unknown',
            confidence: 'low'
        };

    } catch (error) {
        console.error(`Error detecting booking platform for ${websiteUrl}:`, error.message);
        return {
            platform: 'Unknown',
            confidence: 'low'
        };
    }
}

/**
 * Extract owner/contact information from website
 */
export async function extractContactInfo(websiteUrl) {
    if (!websiteUrl) {
        return {};
    }

    try {
        const response = await axios.get(websiteUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const info = {};

        // Try to find owner name (common patterns)
        const aboutPage = $('a[href*="about"]').first().attr('href');
        if (aboutPage) {
            try {
                const aboutUrl = new URL(aboutPage, websiteUrl).href;
                const aboutResponse = await axios.get(aboutUrl, { timeout: 5000 });
                const $about = cheerio.load(aboutResponse.data);

                // Look for owner/founder patterns
                const ownerPatterns = [
                    /owner[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                    /founder[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                    /by\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i
                ];

                const aboutText = $about.text();
                for (const pattern of ownerPatterns) {
                    const match = aboutText.match(pattern);
                    if (match) {
                        info.owner_name = match[1].trim();
                        break;
                    }
                }
            } catch (e) {
                // Ignore errors on about page
            }
        }

        // Find email addresses
        const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const emails = html.match(emailPattern);
        if (emails && emails.length > 0) {
            // Filter out common non-contact emails
            const validEmails = emails.filter(email =>
                !email.includes('example.com') &&
                !email.includes('yourdomain') &&
                !email.includes('test')
            );
            if (validEmails.length > 0) {
                info.email = validEmails[0];
            }
        }

        // Find phone numbers (US format)
        const phonePatterns = [
            /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
            /\d{3}[-.\s]\d{3}[-.\s]\d{4}/g
        ];

        for (const pattern of phonePatterns) {
            const phones = html.match(pattern);
            if (phones && phones.length > 0) {
                info.phone_number = phones[0];
                break;
            }
        }

        return info;

    } catch (error) {
        console.error(`Error extracting contact info from ${websiteUrl}:`, error.message);
        return {};
    }
}

/**
 * Calculate recent reviews metrics (last 90 days)
 */
export function calculateRecentReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        return {
            recent_reviews_count: 0,
            recent_rating_avg: 0
        };
    }

    const ninetyDaysAgo = Date.now() / 1000 - (90 * 24 * 60 * 60);
    const recentReviews = reviews.filter(review => review.time >= ninetyDaysAgo);

    if (recentReviews.length === 0) {
        return {
            recent_reviews_count: 0,
            recent_rating_avg: 0
        };
    }

    const avgRating = recentReviews.reduce((sum, r) => sum + r.rating, 0) / recentReviews.length;

    return {
        recent_reviews_count: recentReviews.length,
        recent_rating_avg: Math.round(avgRating * 10) / 10
    };
}

export default {
    detectBookingPlatform,
    extractContactInfo,
    calculateRecentReviews
};
