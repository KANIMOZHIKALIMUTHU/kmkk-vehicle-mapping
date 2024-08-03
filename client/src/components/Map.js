// src/components/Map/index.js
import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import axios from 'axios';

const MapContainer = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [path, setPath] = useState([]);
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '500px'
  };

  const center = {
    lat: 37.7749, // Default center (San Francisco)
    lng: -122.4194
  };

  // Fetch vehicle data
  const fetchVehicleData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicle-data');
      setVehicleData(response.data);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  useEffect(() => {
    if (vehicleData.length > 0) {
      let index = 0;

      const updatePosition = () => {
        if (index < vehicleData.length) {
          const { latitude, longitude } = vehicleData[index];
          setCurrentPosition({ lat: latitude, lng: longitude });
          setPath(vehicleData.map(({ latitude, longitude }) => ({
            lat: latitude,
            lng: longitude
          })));

          index++;
          setTimeout(updatePosition, 1000); // Update every 1 second
        }
      };

      updatePosition();
    }
  }, [vehicleData]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyDr63qkhdIUs0eTN1d3fVCRvRmNk7ruOaI">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || center}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
      >
        {currentPosition && (
          <>
            <Marker
              position={currentPosition}
              icon={{
                url: "https://i.postimg.cc/RZVn6mmc/vehicle-icon.png",
                scaledSize: new window.google.maps.Size(50, 50) // Adjust the size as needed
              }}
            />
            <Polyline
              path={path}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
              }}
            />
          </>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
