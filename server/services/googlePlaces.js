import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place';

/**
 * Search for hot air balloon operators in a specific state
 */
export async function searchBalloonOperators(state = 'all', maxResults = 100) {
    if (!GOOGLE_API_KEY) {
        console.warn('⚠️  Google Places API key not configured. Using mock data.');
        return getMockBalloonOperators(state);
    }

    const results = [];
    const queries = state === 'all'
        ? ['hot air balloon rides USA', 'hot air balloon company United States']
        : [`hot air balloon rides ${state}`, `hot air balloon company ${state}`];

    for (const query of queries) {
        try {
            const response = await axios.get(`${PLACES_API_BASE}/textsearch/json`, {
                params: {
                    query,
                    key: GOOGLE_API_KEY,
                    type: 'travel_agency'
                }
            });

            if (response.data.results) {
                results.push(...response.data.results);
            }

            // Handle pagination
            let nextPageToken = response.data.next_page_token;
            while (nextPageToken && results.length < maxResults) {
                // Wait 2 seconds (Google requirement before using next_page_token)
                await new Promise(resolve => setTimeout(resolve, 2000));

                const nextResponse = await axios.get(`${PLACES_API_BASE}/textsearch/json`, {
                    params: {
                        pagetoken: nextPageToken,
                        key: GOOGLE_API_KEY
                    }
                });

                if (nextResponse.data.results) {
                    results.push(...nextResponse.data.results);
                }

                nextPageToken = nextResponse.data.next_page_token;
            }
        } catch (error) {
            console.error(`Error searching for "${query}":`, error.message);
        }
    }

    // Remove duplicates by place_id
    const unique = Array.from(new Map(results.map(item => [item.place_id, item])).values());
    return unique.slice(0, maxResults);
}

/**
 * Get detailed information about a place
 */
export async function getPlaceDetails(placeId) {
    if (!GOOGLE_API_KEY) {
        return getMockPlaceDetails(placeId);
    }

    try {
        const response = await axios.get(`${PLACES_API_BASE}/details/json`, {
            params: {
                place_id: placeId,
                key: GOOGLE_API_KEY,
                fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,reviews,geometry,address_components'
            }
        });

        return response.data.result;
    } catch (error) {
        console.error(`Error getting place details for ${placeId}:`, error.message);
        return null;
    }
}

/**
 * Mock data for development/testing without API key
 */
function getMockBalloonOperators(state) {
    const mockCompanies = [
        {
            place_id: 'mock_1',
            name: 'Sunrise Balloon Adventures',
            formatted_address: 'Albuquerque, NM 87104',
            rating: 4.8,
            user_ratings_total: 342,
            geometry: { location: { lat: 35.0844, lng: -106.6504 } }
        },
        {
            place_id: 'mock_2',
            name: 'Sky High Balloons',
            formatted_address: 'Napa, CA 94558',
            rating: 4.9,
            user_ratings_total: 567,
            geometry: { location: { lat: 38.2975, lng: -122.2869 } }
        },
        {
            place_id: 'mock_3',
            name: 'Desert Winds Ballooning',
            formatted_address: 'Phoenix, AZ 85001',
            rating: 4.7,
            user_ratings_total: 234,
            geometry: { location: { lat: 33.4484, lng: -112.0740 } }
        },
        {
            place_id: 'mock_4',
            name: 'Mile High Balloon Company',
            formatted_address: 'Boulder, CO 80301',
            rating: 4.6,
            user_ratings_total: 189,
            geometry: { location: { lat: 40.0150, lng: -105.2705 } }
        },
        {
            place_id: 'mock_5',
            name: 'Smoky Mountain Balloons',
            formatted_address: 'Gatlinburg, TN 37738',
            rating: 4.9,
            user_ratings_total: 421,
            geometry: { location: { lat: 35.7143, lng: -83.5102 } }
        },
        {
            place_id: 'mock_6',
            name: 'Hudson Valley Hot Air Balloons',
            formatted_address: 'Poughkeepsie, NY 12601',
            rating: 4.5,
            user_ratings_total: 156,
            geometry: { location: { lat: 41.7004, lng: -73.9209 } }
        },
        {
            place_id: 'mock_7',
            name: 'Texas Sky Riders',
            formatted_address: 'Austin, TX 78701',
            rating: 4.8,
            user_ratings_total: 298,
            geometry: { location: { lat: 30.2672, lng: -97.7431 } }
        },
        {
            place_id: 'mock_8',
            name: 'Pacific Northwest Balloon Adventures',
            formatted_address: 'Portland, OR 97201',
            rating: 4.7,
            user_ratings_total: 212,
            geometry: { location: { lat: 45.5152, lng: -122.6784 } }
        }
    ];

    if (state !== 'all') {
        const stateAbbrev = state.toUpperCase();
        return mockCompanies.filter(c => c.formatted_address.includes(stateAbbrev));
    }

    return mockCompanies;
}

function getMockPlaceDetails(placeId) {
    const mockDetails = {
        mock_1: {
            name: 'Sunrise Balloon Adventures',
            formatted_address: '123 Sky Lane, Albuquerque, NM 87104',
            formatted_phone_number: '(505) 555-0101',
            website: 'https://sunriseballoonadventures.com',
            rating: 4.8,
            user_ratings_total: 342,
            reviews: [
                { author_name: 'John Doe', rating: 5, text: 'Amazing experience!', time: Date.now() / 1000 - 86400 * 7 },
                { author_name: 'Jane Smith', rating: 5, text: 'Best balloon ride ever!', time: Date.now() / 1000 - 86400 * 14 },
                { author_name: 'Bob Johnson', rating: 4, text: 'Great views!', time: Date.now() / 1000 - 86400 * 30 }
            ],
            geometry: { location: { lat: 35.0844, lng: -106.6504 } },
            address_components: [
                { types: ['locality'], long_name: 'Albuquerque' },
                { types: ['administrative_area_level_1'], short_name: 'NM' },
                { types: ['postal_code'], long_name: '87104' }
            ]
        }
    };

    return mockDetails[placeId] || mockDetails.mock_1;
}

export default {
    searchBalloonOperators,
    getPlaceDetails
};
