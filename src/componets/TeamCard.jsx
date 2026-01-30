import React from "react";
import { motion } from "framer-motion";

export default function TeamCard({
  team,
  onBid,
  isHighest,
  currentBid,
  basePrice,
}) {
  const MAX_PLAYERS = 13;

  // Handle bid click
  const handleBid = () => {
    const nextBid = currentBid ? currentBid + 2 : basePrice;

    if (team.purse < nextBid) {
      alert(`${team.name} does not have enough purse!`);
      return;
    }

    if (team.players.length >= MAX_PLAYERS) {
      alert(`${team.name} has reached the max players!`);
      return;
    }

    onBid(team.id, nextBid);
  };

  const canBid =
    !isHighest &&
    team.purse >= (currentBid || basePrice) &&
    team.players.length < MAX_PLAYERS;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,215,0,0.5)" }}
      style={{
        backgroundColor: "#0a1d4c",
        color: "white",
        borderRadius: "12px",
        border: isHighest ? "2px solid gold" : "1px solid #444",
        boxShadow: isHighest
          ? "0 0 20px 5px gold"
          : "0 0 6px 1px rgba(255,255,255,0.15)",
        padding: "10px",
        width: "180px",
        textAlign: "center",
        fontSize: "0.85rem",
      }}
    >
      {/* Team Logo */}
      {team.logo && (
        <img
          src={team.logo}
          alt={`${team.name} logo`}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
            border: isHighest ? "2px solid gold" : "1px solid white",
            marginBottom: "6px",
          }}
        />
      )}

      {/* Team Name */}
      <h4 style={{ color: isHighest ? "gold" : "white", margin: "4px 0" }}>
        {team.name}
      </h4>

      {/* Purse */}
      <p style={{ margin: "2px 0" }}>💰 ₹{team.purse}</p>

      {/* Current Bid */}
      <p style={{ margin: "2px 0", color: "#ccc" }}>
        {currentBid ? `Bid: ₹${currentBid}` : `Base: ₹${basePrice}`}
      </p>

      {/* Player Count / Max */}
      <div style={{ width: "100%", margin: "4px 0" }}>
        <p style={{ margin: 0, fontSize: "0.75rem" }}>
          Players: {team.players.length}/{MAX_PLAYERS}
        </p>
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "#333",
            borderRadius: "3px",
            overflow: "hidden",
            marginTop: "2px",
          }}
        >
          <div
            style={{
              width: `${(team.players.length / MAX_PLAYERS) * 100}%`,
              height: "100%",
              background: "#ffd700",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Player List */}
      {team.players.length > 0 && (
        <div
          style={{
            marginTop: "6px",
            background: "#1b2a64",
            borderRadius: "8px",
            padding: "4px",
            width: "100%",
            maxHeight: "80px",
            overflowY: "auto",
          }}
        >
          <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "0.7rem" }}>
            {team.players.map((player) => (
              <li key={player.id} style={{ color: "#fff" }}>
                {player.name} ({player.role})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bid Button */}
      <button
        onClick={handleBid}
        disabled={!canBid}
        style={{
          marginTop: "6px",
          backgroundColor: canBid ? "#007bff" : "#555",
          color: "#fff",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: canBid ? "pointer" : "not-allowed",
          fontWeight: "600",
          fontSize: "0.8rem",
          width: "100%",
          transition: "0.3s",
        }}
      >
        {isHighest ? "Highest" : `Bid ₹${currentBid ? currentBid + 2 : basePrice}`}
      </button>
    </motion.div>
  );
}