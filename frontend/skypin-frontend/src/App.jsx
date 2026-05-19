import { useState } from "react";
import "./App.css";

function App() {

  return (
    <>
      <section id="center">
        <div>
          
          <form id="addressForm">
            <fieldset>
              <legend><h1>Enter your address</h1></legend>

              <input
                type="text"
                name="street"
                placeholder="House No & Street Name"
              />
              <br />
              <input type="text" id="city" placeholder="City*" />
              <br />
              <input
                type="text"
                name="county"
                placeholder="County / District"
              />
              <br />
              <input type="text" name="state" placeholder="State / Region" />
              <br />
              <input type="text" id="country" placeholder="Country*" />
            <br />
              <input type="text" id="postalcode" placeholder="Postal Code" />
            </fieldset>

            <button type="submit">Get Weather</button>

            <p id="error" style={{ color: "red" }}></p>
          </form>
        </div>
      </section>
    </>
  );
}

export default App;
