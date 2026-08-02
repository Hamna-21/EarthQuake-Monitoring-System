import { Router } from 'express';
import { fetchRealtimeEarthquakes } from '../services/earthquakeService';
import { fetchHistoricalEarthquakes } from '../services/historicalEarthquakeService';

const router = Router();

router.get('/history', async (req, res) => {
  try {
    res.json(await fetchHistoricalEarthquakes(req.query));
  } catch (error) {
    const raw = error instanceof Error ? error.message : 'Unable to fetch historical earthquake data.';
    const message = raw.toLowerCase().includes('abort') || raw.toLowerCase().includes('timeout')
      ? 'The selected date range is taking too long to load. Please narrow the range or try again.'
      : raw;
    const status = message.includes('date') || message.includes('future') || message.includes('earlier') ? 400 : 502;
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
