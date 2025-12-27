import { useState, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet's default icon is not set up out-of-the-box with webpack.
// We need to manually fix the icon path.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = ({ selectedPosition, setSelectedPosition }) => {
    const [currentPosition, setCurrentPosition] = useState(selectedPosition);
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPosition = marker.getLatLng();
                    setSelectedPosition(newPosition);
                    setCurrentPosition(newPosition);
                }
            },
        }),
        [setSelectedPosition],
    );

    const mapContainerStyle = {
        height: '100%',
        width: '100%',
        borderRadius: '0.5rem',
    };

    return (
        <MapContainer 
            center={currentPosition} 
            zoom={13} 
            style={mapContainerStyle}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={currentPosition}
                ref={markerRef}
            >
                <Popup>
                    Drag to set the exact pickup location.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;
