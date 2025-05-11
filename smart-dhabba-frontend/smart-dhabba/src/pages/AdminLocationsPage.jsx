import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 33.6844,
  lng: 73.0479,
};

const AdminLocationsPage = () => {
  const token = localStorage.getItem("token");
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/users/students-locations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLocations(res.data);
      } catch (error) {
        console.error("Failed to fetch student locations", error);
      }
    };

    fetchLocations();
  }, [token]);

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h2>All Student Locations</h2>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={6}
        center={defaultCenter}
      >
        {locations.map((user) => (
          <Marker
            key={user._id}
            position={user.location}
            onClick={() => setSelected(user)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={selected.location}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h4>{selected.name}</h4>
              <p>{selected.email}</p>
              <p>
                Lat: {selected.location.lat} <br />
                Lng: {selected.location.lng}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default AdminLocationsPage;
