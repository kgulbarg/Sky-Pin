import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [error, setError] = useState("");

  const isValid = postalcode.trim() !== "" || (city.trim() !== "" && country.trim() !== "");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValid) {
      setError("Provide either postal code, or both city and country");
      return;
    }
    
    setError("");
    // Handle form submission here
    console.log({ city, country, postalcode });
  };

  return (
    <>
      <section id="center">
        <div>
          
          <form id="addressForm" onSubmit={handleSubmit}>
            <fieldset>
              <legend><h1>Enter your address</h1></legend>

              <div style={{ fontSize: "0.9rem", marginBottom: "1rem", padding: "0.5rem", textAlign: "left" }}>
                <div style={{ marginBottom: "0rem", color: isValid ? "green" : "red", display: "flex" }}>Please provide at least one of the following:</div>
                <div style={{ marginBottom: "0rem", display: "flex" }}>
                  <span>{postalcode.trim() !== "" ? "✓" : "◯"}</span> &nbsp;Postal code
                </div>
                <div style={{ display: "flex" }}>
                  <span>{city.trim() !== "" && country.trim() !== "" ? "✓" : "◯"}</span> &nbsp;City AND country
                </div>
              </div>

              <label htmlFor="street">House No & Street Name</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder="House No & Street Name"
              />
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label htmlFor="county">County / District</label>
              <input
                type="text"
                id="county"
                name="county"
                placeholder="County / District"
              />
              <label htmlFor="state">State / Region</label>
              <input type="text" id="state" name="state" placeholder="State / Region" />
              <label htmlFor="country">Country</label>
              <input 
                type="text" 
                id="country" 
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <label htmlFor="postalcode">Postal Code</label>
              <input 
                type="text" 
                id="postalcode" 
                placeholder="Postal Code"
                value={postalcode}
                onChange={(e) => setPostalcode(e.target.value)}
              />
            </fieldset>

            <button type="submit" disabled={!isValid}>Get Weather</button>

            <p id="error">{error}</p>
          </form>
        </div>
      </section>
    </>
  );
}

export default App;
