import { Router } from 'express';
import { fetchRealtimeEarthquakes } from '../services/earthquakeService';
import { fetchHistoricalEarthquakes } from '../services/historicalEarthquakeService';

const router = Router();

// Translate service failures into stable status codes for both historical and live earthquake clients.
router.get('/history', async (req, res) => {
  try {
    res.json(await fetchHistoricalEarthquakes(req.query));
  } catch (error) {
    const raw = error instanceof Error ? error.message : 'Unable to fetch historical earthquake data.';
    const timedOut = /abort|timeout|timed out/i.test(raw);
    const message = timedOut ? 'Historical data is taking longer than expected. Please try again.' : raw;
    const status = message.includes('date') || message.includes('future') || message.includes('earlier') ? 400 : timedOut ? 504 : 503;
    res.status(status).json({ success: false, source: 'USGS', message, earthquakes: [] });
  }
});

router.get('/', async (req, res) => {
  try {
    res.json(await fetchRealtimeEarthquakes(req.query));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch earthquake data.';
    res.status(502).json({ success: false, source: 'USGS', lastUpdated: new Date().toISOString(), count: 0, earthquakes: [], error: message });
  }
});

export default router;
