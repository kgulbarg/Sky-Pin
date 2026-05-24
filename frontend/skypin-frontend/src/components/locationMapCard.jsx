import "../styles/mapCard.css";

import { BsGeoAltFill } from "react-icons/bs";

function getLocationLabel(location) {
  if (!location) {
    return "";
  }

  if (typeof location === "string") {
    return location;
  }

  return location.display_name || "Selected location";
}

function buildEmbedUrl(latitude, longitude) {
  const latDelta = 0.028;
  const lonDelta = 0.028;
  const south = latitude - latDelta;
  const north = latitude + latDelta;
  const west = longitude - lonDelta;
  const east = longitude + lonDelta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

function LocationMapCard({ location, onClose }) {
  if (!location || location.latitude == null || location.longitude == null) {
    return null;
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const locationLabel = getLocationLabel(location);
  const embedUrl = buildEmbedUrl(latitude, longitude);

  return (
    <section id="weatherPage" aria-live="polite">
      <div id="weatherResult" className="map-result">
        <div className="map-result-header">
          <div className="weather-text">
            <p className="weather-kicker">Map view</p>
            <h2>{locationLabel}</h2>
            <p className="map-coordinates">
              <BsGeoAltFill /> {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>

          <button className="action-button" type="button" onClick={onClose}>
            Back to weather
          </button>
        </div>

        <div
          className="map-card"
          aria-label={`Map centered on ${locationLabel}`}
        >
          <iframe
            className="map-frame"
            title={`Map centered on ${locationLabel}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p className="map-note">
          The pin marks the selected location at the center of the map preview.
        </p>
      </div>
    </section>
  );
}

export default LocationMapCard;
