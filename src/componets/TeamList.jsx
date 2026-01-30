import React from "react";
import TeamCard from "./TeamCard";
import { motion } from "framer-motion";

export default function TeamList({
  teams,
  onBid,
  highestBidder,
  currentBid,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        maxHeight: "85vh",
        overflowY: "auto",
        paddingRight: "8px",
        justifyContent: "center",
      }}
    >
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          onBid={onBid}
          isHighest={highestBidder === team.id}
          currentBid={currentBid}
        />
      ))}
    </div>
  );
}