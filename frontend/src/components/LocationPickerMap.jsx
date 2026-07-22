import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing issue in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

// Component to handle flying to a new location
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, zoom, map]);
  return null;
};

const districtCoordinates = {
  "Thiruvananthapuram": [8.5241, 76.9366],
  "Kollam": [8.8932, 76.6141],
  "Pathanamthitta": [9.2648, 76.7870],
  "Alappuzha": [9.4981, 76.3388],
  "Kottayam": [9.5916, 76.5222],
  "Idukki": [9.8500, 76.9492],
  "Ernakulam": [9.9816, 76.2999],
  "Thrissur": [10.5276, 76.2144],
  "Palakkad": [10.7867, 76.6548],
  "Malappuram": [11.0733, 76.0740],
  "Kozhikode": [11.2588, 75.7804],
  "Wayanad": [11.6854, 76.1320],
  "Kannur": [11.8745, 75.3704],
  "Kasaragod": [12.4996, 74.9869]
};

const LocationPickerMap = ({ onLocationSelect }) => {
  // Default center: Kerala, India
  const defaultCenter = [10.8505, 76.2711];
  const defaultZoom = 7;
  
  const [position, setPosition] = useState(null);
  const [district, setDistrict] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  const districts = Object.keys(districtCoordinates);

  // When position or district changes, format the address string
  useEffect(() => {
    if (position && district) {
      const addressString = `${district} - [${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}]`;
      onLocationSelect(addressString);
    } else {
      onLocationSelect('');
    }
  }, [position, district, onLocationSelect]);

  // Handle District Change
  const handleDistrictChange = (e) => {
    const selected = e.target.value;
    setDistrict(selected);
    
    // Clear previous pin when changing districts
    setPosition(null);
    
    if (selected && districtCoordinates[selected]) {
      setMapCenter(districtCoordinates[selected]);
      setMapZoom(11); // Zoom in closer to the district
    } else {
      setMapCenter(defaultCenter);
      setMapZoom(defaultZoom); // Reset to full Kerala view
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select District
        </label>
        <select 
          value={district}
          onChange={handleDistrictChange}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
        >
          <option value="">-- Choose your District --</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Drop a pin on your exact location
        </label>
        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
          <MapContainer 
            center={defaultCenter} 
            zoom={defaultZoom} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
        {!position && district && (
          <p className="text-red-500 text-xs mt-1 font-medium">Please tap on the map to pin your location inside {district}.</p>
        )}
      </div>
    </div>
  );
};

export default LocationPickerMap;
