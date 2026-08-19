import { useState, useEffect, useCallback, useRef } from 'react';
import { SeismicFilters, Earthquake } from '@/types';
import { fetchEarthquakes } from '@/features/earthquakes/services/earthquakeApi';

export function useEarthquakes() {
  const [filters, setFilters] = useState<SeismicFilters>({
    viewType: "live",
    region: "",
    minMagnitude: 4,
    timeframe: "24h",
    alertClass: "all",
  });

  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isWarningHubOpen, setIsWarningHubOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  const requestId = useRef(0);

  const loadSeismicData = useCallback(async (activeFilters: SeismicFilters) => {
    // Abort prior work and guard by request id so a slower response cannot replace newer filters.
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const id = ++requestId.current;
    setIsSearching(true);
    setDataError(null);

    try {
      const data = await fetchEarthquakes(activeFilters, controller.signal);
      if (id !== requestId.current) return;
      setEarthquakes(data);
      setLastUpdated(Date.now());

      if (data.length > 0) {
        setSelectedId(data[0].id);
      } else {
        setSelectedId(null);
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error(err);
      setDataError(err instanceof Error ? err.message : "Unable to fetch earthquake data.");
    } finally {
      if (id === requestId.current) setIsSearching(false);
    }
  }, []);

  useEffect(() => () => requestRef.current?.abort(), []);

  useEffect(() => {
    loadSeismicData(filters);
  }, [filters.timeframe, filters.minMagnitude, loadSeismicData]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadSeismicData(filters);
    }, 60000);

    return () => window.clearInterval(interval);
  }, [filters, loadSeismicData]);

  useEffect(() => {
    setSearchValue(filters.region);
  }, [filters.region]);

  const handleExecuteSearch = () => {
    loadSeismicData(filters);
    document
      .getElementById("dashboard-deck")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectEarthquake = (quake: Earthquake) => {
    setSelectedId(quake.id);
  };

  const handleLocalSearchChange = (query: string) => {
    setSearchValue(query);
    setFilters((prev) => ({
      ...prev,
      region: query,
    }));
  };

  return {
    filters,
    setFilters,
    earthquakes,
    setEarthquakes,
    isSearching,
    dataError,
    lastUpdated,
    selectedId,
    setSelectedId,
    isWarningHubOpen,
    setIsWarningHubOpen,
    searchValue,
    setSearchValue,
    loadSeismicData,
    handleExecuteSearch,
    handleSelectEarthquake,
    handleLocalSearchChange,
  };
}
