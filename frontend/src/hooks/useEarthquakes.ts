import { useState, useEffect, useCallback } from 'react';
import { SeismicFilters, Earthquake } from '../types';
import { fetchEarthquakes } from '../utils/usgsApi';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isWarningHubOpen, setIsWarningHubOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const loadSeismicData = useCallback(async (activeFilters: SeismicFilters) => {
    setIsSearching(true);
    setDataError(null);

    try {
      const data = await fetchEarthquakes(activeFilters);
      setEarthquakes(data);

      if (data.length > 0) {
        setSelectedId(data[0].id);
      } else {
        setSelectedId(null);
      }
    } catch (err) {
      console.error(err);
      setDataError(err instanceof Error ? err.message : "Unable to fetch earthquake data.");
    } finally {
      setIsSearching(false);
    }
  }, []);

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
