import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues with Webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AvailableBloodTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [donors, setDonors] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    // Fetch nearby donors when user location is available
    if (userLocation) {
      fetchNearbyDonors(userLocation);
    }
  }, [userLocation]);

  const fetchNearbyDonors = async (location) => {
    // This is a placeholder. In a real application, you would make an API call to your backend
    // to fetch donors near the given location.
    const mockDonors = [
      {
        id: 1,
        name: 'John Doe',
        bloodType: 'A+',
        location: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
      },
      {
        id: 2,
        name: 'Jane Smith',
        bloodType: 'O-',
        location: { lat: location.lat - 0.01, lng: location.lng - 0.01 },
      },
      // Add more mock donors as needed
    ];
    setDonors(mockDonors);
  };

  const openDirectionsInGoogleMaps = (donorLocation) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${donorLocation.lat},${donorLocation.lng}&travelmode=driving`;
      window.open(url, '_blank');
    }
  };

  // Component to change the map view when userLocation changes
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <div className="available-blood-tracker">
      <h1 className="text-2xl font-bold mb-4">Available Blood Donors</h1>
      {userLocation ? (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
          style={{ height: '400px', width: '100%' }}
        >
          <ChangeView center={[userLocation.lat, userLocation.lng]} zoom={12} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User's location marker */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Donor markers */}
          {donors.map((donor) => (
            <Marker
              key={donor.id}
              position={[donor.location.lat, donor.location.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedDonor(donor);
                  openDirectionsInGoogleMaps(donor.location);
                },
              }}
            >
              <Popup>
                <div>
                  <h2>{donor.name}</h2>
                  <p>Blood Type: {donor.bloodType}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default AvailableBloodTracker;
