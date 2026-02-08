import React, { Component } from "react";
import "../App.css";
import { logAction as logActionAPI, getUserSummary } from "../api/apiService";

export default class Actions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: 0,
      width: window.innerWidth,
      loading: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
    this.loadUserPoints();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  loadUserPoints = async () => {
    if (!this.props.userId) return;

    try {
      const summary = await getUserSummary(this.props.userId);
      this.setState({ points: summary.total_points });
    } catch (error) {
      console.error("Failed to load points:", error);
    }
  };

  logPoints = async (actionType) => {
    if (!this.props.userId) {
      alert("User not logged in!");
      return;
    }

    this.setState({ loading: true });

    try {
      const result = await logActionAPI(this.props.userId, actionType);
      this.setState({ 
        points: result.new_total_points,
        loading: false 
      });
    } catch (error) {
      alert("Failed to log action. Make sure your backend is running!");
      this.setState({ loading: false });
    }
  };

  render() {
    const { points, width, loading } = this.state;
    const isMobile = width <= 800;

    return (
      <div>
        {/* Netflix-style navbar */}
        <nav className="navbar">
          <a href="/" className="logo">
            Golden Kingston
          </a>
          <button>Profile</button>
        </nav>

        {/* Golden Aura Display */}
        <div className="features">
          <div className="featureNav" style={{ justifyContent: "center" }}>
            <a onClick={() => this.logPoints("transport")}>
              <h2>🚶 Walk</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints("transport")}>
              <h2>🚲 Bike</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints("transport")}>
              <h2>🚌 Transit</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints("waste")}>
              <h2>♻ Reduce Waste</h2>
              {!isMobile && <span className="selected-span" />}
            </a>
            <a onClick={() => this.logPoints("wellbeing")}>
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
            {loading && <p style={{ fontSize: "14px", color: "#666" }}>Logging action...</p>}
          </div>
        </div>
      </div>
    );
  }
}