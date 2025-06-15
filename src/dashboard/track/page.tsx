// ==== TrackingPage.tsx ====
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
});

export default function TrackingPageTest() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch to populate metadata like name/model
    const loadInitialVehicles = async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      try {
        const res = await fetch(`${API_URL}/vehicles`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setVehicles(data.data.vehicles);
        }
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      }
    };

    loadInitialVehicles();

    // Listen for live updates
    socket.on('vehicle_data', (data) => {
      setVehicles((prevVehicles) => {
        const index = prevVehicles.findIndex((v) => v.imei === data.imei);
        const updatedVehicle = {
          ...prevVehicles[index],
          lat: data.lat,
          lon: data.lon,
          currentStatus: data.ignition
            ? data.speed > 0
              ? 'moving'
              : 'stopped'
            : 'inactive',
          telemetry: {
            ...prevVehicles[index]?.telemetry,
            ...data,
          },
        };

        if (index !== -1) {
          const copy = [...prevVehicles];
          copy[index] = updatedVehicle;
          return copy;
        } else {
          return [...prevVehicles, updatedVehicle];
        }
      });
    });

    return () => {
      socket.off('vehicle_data');
    };
  }, []);

  return (
    <div>
      <h1>Live Vehicle Tracking</h1>
      <ul>
        {vehicles.map((v) => (
          <li key={v.imei}>
            {v.name} ({v.licensePlate}): {v.currentStatus} at {v.lat}, {v.lon}
          </li>
        ))}
      </ul>
    </div>
  );
}
