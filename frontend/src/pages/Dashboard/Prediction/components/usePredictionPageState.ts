import { FormEvent, useMemo, useState } from 'react';
import { timeMs } from '../../../../components/dashboard/data';
import type { Earthquake } from '../../../../types';
import { reverseLocation } from '../../Nearby/nearbyUtils';
import { distanceKm, formatLocationLabel, radiusOptions, searchLocation, sevenDaysMs, thirtyDaysMs, type UserLocation } from './predictionHelpers';
import { getPredictionSignals } from './predictionSignals';

type NearbyEarthquake = Earthquake & { distanceKm: number };
export function usePredictionPageState(earthquakes: Earthquake[]) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(200);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location detection is not supported.');
      return;
    }

    setLocationError(null);
    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const place = await reverseLocation(latitude, longitude);
          setUserLocation({ latitude, longitude, label: formatLocationLabel(place, 'Current location') });
        } catch {
          setUserLocation({ latitude, longitude, label: 'Current location' });
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setLocationError('Location permission was denied. Search for your city manually.');
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  };
  const submitLocationSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = locationQuery.trim();

    if (!query) {
      setLocationError('Enter a city or location name first.');
      return;
    }

    setIsSearching(true);
    setLocationError(null);

    try {
      const result = await searchLocation(query);
      if (!result) {
        setLocationError('No matching location was found.');
        return;
      }

      setUserLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        label: [result.name, result.admin1, result.country].filter(Boolean).join(', ') || result.name
      });
    } catch {
      setLocationError('Location search failed. Try another city name.');
    } finally {
      setIsSearching(false);
    }
  };

  const nearbyEarthquakes = useMemo<NearbyEarthquake[]>(() => {
    if (!userLocation) return [];
    return earthquakes
      .map((event) => ({ ...event, distanceKm: distanceKm(userLocation.latitude, userLocation.longitude, event.latitude, event.longitude) }))
      .filter((event) => event.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [earthquakes, radiusKm, userLocation]);

  const recent7Days = useMemo(() => nearbyEarthquakes.filter((event) => Date.now() - timeMs(event.time) <= sevenDaysMs), [nearbyEarthquakes]); const recent30Days = useMemo(() => nearbyEarthquakes.filter((event) => Date.now() - timeMs(event.time) <= thirtyDaysMs), [nearbyEarthquakes]);

  const shallowCount = recent7Days.filter((event) => event.depth <= 50).length;
  const strongestMagnitude = recent7Days.reduce((maximum, event) => Math.max(maximum, event.magnitude), 0); const nearestEvent = nearbyEarthquakes[0] ?? null; const { score, outlook, confidence } = getPredictionSignals(recent7Days.length, shallowCount, strongestMagnitude, nearbyEarthquakes.length);

  return {
    locationLabel: userLocation?.label ?? 'Select a location',
    locationQuery,
    locationError,
    radiusKm,
    radiusOptions,
    isDetecting,
    isSearching,
    outlook,
    score,
    confidence,
    recent7DaysCount: recent7Days.length,
    recent30DaysCount: recent30Days.length,
    shallowCount,
    strongestMagnitude,
    nearestEvent,
    onLocationQueryChange: setLocationQuery, onRadiusChange: setRadiusKm,
    onUseLocation: detectLocation,
    onSearchSubmit: submitLocationSearch
  };
}