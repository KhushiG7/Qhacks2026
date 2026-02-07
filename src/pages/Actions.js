import React, { useState } from "react";
import styled, { css } from "styled-components";
import netflixlogo from "./img/logo.svg";

/* ===== NAVBAR ===== */
const Nav = styled.nav`
  height: 90px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #003f7c, #005fa3);
  padding: 0 3%;
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);

  img {
    width: 167px;
    height: 45px;
    vertical-align: middle;
  }

  .logo {
    line-height: 90px;
    font-size: 1.5rem;
    color: white;
    font-weight: bold;
  }
`;

const SignInButton = styled.button`
  color: white;
  cursor: pointer;
  background-color: #e50914;
  padding: 7px 17px;
  font-weight: 100;
  border: transparent;
  border-radius: 3px;
  font-size: 16px;
  ${props => props.right && css`
    float: right;
  `}
  &:hover {
    background-color: #E53935;
  }
`;

/* ===== GOLDEN AURA CARD ===== */
const GoldenAuraCard = styled.div`
  background: radial-gradient(circle at center, #fff8dc, #ffd70055);
  border-radius: 28px;
  padding: 36px;
  text-align: center;
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: auraPulse 3s ease-in-out infinite;
  margin: 40px auto;
  width: 200px;

  @keyframes auraPulse {
    0% { transform: scale(1); box-shadow: 0 0 20px #ffd70066; }
    50% { transform: scale(1.03); box-shadow: 0 0 40px #ffd700aa; }
    100% { transform: scale(1); box-shadow: 0 0 20px #ffd70066; }
  }
`;

const AuraCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background: radial-gradient(circle, #fffacd, #ffd700);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 15px #ffd700aa;
  animation: spinAura 6s linear infinite;

  @keyframes spinAura {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AuraPoints = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #003f7c;
`;

/* ===== ACTIONS CARD ===== */
const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  width: 380px;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  margin: 40px auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5);
`;

const Points = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #003f7c;
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

const ActionButton = styled.button`
  flex: 1 1 calc(33% - 12px);
  margin: 8px 0;
  padding: 12px 18px;
  border-radius: 16px;
  font-weight: 600;
  background: #ffffff;
  box-shadow: 0 6px 0 #cfd8dc;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 10px 0 #cfd8dc;
    background: #f0f8ff;
  }
`;

/* ===== MAIN COMPONENT ===== */
export default function Actions() {
  const [points, setPoints] = useState(0);

  const log = (p) => setPoints(points + p);

  return (
    <div>
      {/* Navbar */}
      <Nav>
        <a href="/" className="logo">
          <img src={netflixlogo} alt="Netflix Logo" />
        </a>
        <SignInButton right>Profile</SignInButton>
      </Nav>

      {/* Golden Aura */}
      <GoldenAuraCard>
        <AuraCircle />
        <AuraPoints>{points}</AuraPoints>
      </GoldenAuraCard>

      {/* Actions Card */}
      <Card>
        <h2>Log Actions</h2>
        <Points>Total Points: {points}</Points>
        <ButtonGrid>
          <ActionButton onClick={() => log(2)}>🚶 Walk</ActionButton>
          <ActionButton onClick={() => log(3)}>🚲 Bike</ActionButton>
          <ActionButton onClick={() => log(1)}>🚌 Transit</ActionButton>
          <ActionButton onClick={() => log(2)}>♻ Reduce Waste</ActionButton>
          <ActionButton onClick={() => log(2)}>🧘 Mindfulness</ActionButton>
        </ButtonGrid>
      </Card>
    </div>
  );
}
