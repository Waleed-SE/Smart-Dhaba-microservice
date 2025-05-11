import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 33.6844, // Default center (e.g., Islamabad)
  lng: 73.0479,
};

const StudentLocationPage = () => {
  const [marker, setMarker] = useState(null);
  const [message, setMessage] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleSave = async () => {
    if (!marker) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/save-location`,
        marker,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Location saved successfully!");
    } catch (error) {
      console.error("Error saving location:", error);
      setMessage("Error saving location.");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Select Your Location</h2>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={marker || center}
          zoom={12}
          onClick={onMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      ) : (
        <p>Loading Map...</p>
      )}

      {marker && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Latitude:</strong> {marker.lat}
            <br />
            <strong>Longitude:</strong> {marker.lng}
          </p>
          <button onClick={handleSave}>Save Location</button>
        </div>
      )}

      {message && (
        <p style={{ marginTop: "15px", color: "green" }}>{message}</p>
      )}
    </div>
  );
};

export default StudentLocationPage;
