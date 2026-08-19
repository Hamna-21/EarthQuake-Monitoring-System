export type LocationDetails = {
  lat: number;
  lon: number;
  label?: string;
  city?: string;
  region?: string;
  country?: string;
};

export async function reverseLocation(lat: number, lon: number): Promise<LocationDetails> {
  // Convert the browser's coordinates into a readable place label for nearby-earthquake requests.
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
  if (!response.ok) throw new Error('Reverse geocoding failed.');
  const data = await response.json();
  const address = data.address ?? {};
  return {
    lat,
    lon,
    city: address.city ?? address.town ?? address.village ?? address.county,
    region: address.state ?? address.province ?? address.region,
    country: address.country,
  };
}
