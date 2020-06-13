import React from "react";
import logo from "./logo.svg";
import Api from "./Api.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Api></Api>
      </header>
    </div>
  );
}

export default App;
