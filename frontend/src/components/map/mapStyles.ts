export function markerColor(magnitude: number) {
  if (magnitude >= 7) return '#7f1d1d';
  if (magnitude >= 6) return '#dc2626';
  if (magnitude >= 5) return '#f97316';
  if (magnitude >= 4) return '#facc15';
  if (magnitude >= 2) return '#22c55e';
  return '#3b82f6';
}

export const mapTiles = {
  dark: {
    label: 'Dark Theme',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap © CARTO',
  },
  street: {
    label: 'Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
  },
  terrain: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap © OpenTopoMap',
  },
};

export type MapTileKey = keyof typeof mapTiles;
