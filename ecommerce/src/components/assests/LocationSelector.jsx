// LocationSelector.js
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Loader } from 'lucide-react';
import './LocationSelector.css';

const LocationSelector = ({ isOpen, onClose, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [processingLocation, setProcessingLocation] = useState(false);
  const [geocodeResponse, setGeocodeResponse] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const geocoderRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadGoogleMaps();
    }
  }, [isOpen]);
  

  const loadGoogleMaps = async () => {
    try {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    } catch (error) {
      setError('Error loading map');
    }
  };

  const initializeMap = () => {
    // Check if geolocation is available 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get user's current latitude and longitude
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Map options with the current location
          const mapOptions = {
            zoom: 8,
            center: currentLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          };
  
          // Initialize the map with the current location
          googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
          geocoderRef.current = new window.google.maps.Geocoder();
  
          googleMapRef.current.addListener('click', (e) => {
            handleMapClick(e.latLng);
          });
  
          markerRef.current = new window.google.maps.Marker({
            map: googleMapRef.current,
            draggable: true,
          });
  
          markerRef.current.addListener('dragend', () => {
            const position = markerRef.current.getPosition();
            handleGeocodeByLatLng(position);
          });
        },
        (error) => {
          // If geolocation fails, fallback to a default location
          console.error("Geolocation failed: ", error);
          const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Default location
          const mapOptions = {
            zoom: 8,
            center: defaultLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          };
  
          googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
          geocoderRef.current = new window.google.maps.Geocoder();
        }
      );
    } else {
      // Geolocation is not supported, fallback to default location
      const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Default location
      const mapOptions = {
        zoom: 8,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };
  
      googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  };
  const handleMapClick = (latLng) => {
    handleGeocodeByLatLng(latLng);
  };

  const handleGeocodeByLatLng = async (latLng) => {
    setProcessingLocation(true);
    try {
      const result = await geocoderRef.current.geocode({ location: latLng });
      if (result.results && result.results[0]) {
        const location = {
          lat: latLng.lat(),
          lng: latLng.lng(),
          address: result.results[0].formatted_address
        };
        updateLocationAndMarker(location);
        setGeocodeResponse(result);
      }
    } catch (error) {
      setError('Error geocoding location');
    } finally {
      setProcessingLocation(false);
    }
  };

  const handleGeocodeByAddress = async (address) => {
    setProcessingLocation(true);
    try {
      const result = await geocoderRef.current.geocode({ address });
      if (result.results && result.results[0]) {
        const location = {
          lat: result.results[0].geometry.location.lat(),
          lng: result.results[0].geometry.location.lng(),
          address: result.results[0].formatted_address
        };
        updateLocationAndMarker(location);
        setGeocodeResponse(result);
      }
    } catch (error) {
      setError('Error geocoding address');
    } finally {
      setProcessingLocation(false);
    }
  };

  const updateLocationAndMarker = (location) => {
    setSelectedLocation(location);
    googleMapRef.current.setCenter(location);
    googleMapRef.current.setZoom(15);
    markerRef.current.setPosition(location);
    setSearchQuery(location.address);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleGeocodeByAddress(searchQuery);
    }
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setGeocodeResponse(null);
    markerRef.current.setMap(null);
    initializeMap();
  };

  if (!isOpen) return null;

  return (
    <div className="location-selector-overlay">
      <div className="location-selector-modal">
        <div className="modal-header">
          <h2 className="modal-title">Select Your Location</h2>
          <button onClick={onClose} className="close-button">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter a location or click on the map"
              className="search-input"
            />
            <button type="submit" className="button button-primary">
              Search
            </button>
            <button
              type="button"
              onClick={clearLocation}
              className="button button-secondary"
            >
              Clear
            </button>
          </form>

          {processingLocation && (
            <div className="alert alert-info">
              <Loader className="loading-spinner" />
              <span>Processing location... Please wait</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="map-container">
            <div ref={mapRef} className="map" />
            <div className="response-container">
              {geocodeResponse && (
                <pre className="response-code">
                  {JSON.stringify(geocodeResponse, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {selectedLocation && (
            <div className="selected-location">
              <MapPin />
              <span>{selectedLocation.address}</span>
            </div>
          )}

          <div className="button-group">
            <button
              onClick={onClose}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedLocation) {
                  onLocationSelect(selectedLocation);
                  onClose();
                }
              }}
              disabled={!selectedLocation || processingLocation}
              className="button button-primary"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;