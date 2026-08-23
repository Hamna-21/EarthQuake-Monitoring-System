// Keep provider tile URLs and attribution in one place for the 2D map style selector.
export { markerColor } from './markerDesign';

export const mapTiles = {
  dark: {
    label: 'Dark Theme',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap © CARTO',
  },
  night: {
    label: 'Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap © CARTO',
  },
  street: {
    label: 'Street Map ',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap',
  },
  terrain: {
    label: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '© OpenStreetMap © OpenTopoMap',
  },
};

export type MapTileKey = keyof typeof mapTiles;
