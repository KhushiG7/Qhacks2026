import React, { useState, Component } from "react";
import "./App.css"; // Make sure App.css has the styles below
import netflixlogo from "./img/logo.svg";

/* ===================
   Actions Component
=================== */
export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: 0,
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  logPoints = (p) => {
    this.setState({ points: this.state.points + p });
  };

  render() {
    const { points, width } = this.state;
    const isMobile = width <= 800;

    return (
      <div>
        {/* Netflix-style navbar */}
        <nav className="navbar">
          <a href="/" className="logo">
            <img src={netflixlogo} alt="Logo" />
          </a>
          <button>Profile</button>
        </nav>

        {/* Golden Aura Display */}
        <div className="features">
          <div className="featureNav" style={{ justifyContent: "center" }}>
            <a onClick={() => this.logPoints(2)}>
              <h2>🚶 Walk</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints(3)}>
              <h2>🚲 Bike</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints(1)}>
              <h2>🚌 Transit</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints(2)}>
              <h2>♻ Reduce Waste</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints(2)}>
              <h2>🧘 Mindfulness</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
          </div>
        </div>

        {/* Points Card */}
        <div className="wrapper">
          <div className="card">
            <h2>Total Points</h2>
            <p>{points}</p>
          </div>
        </div>
      </div>
    );
  }
}
