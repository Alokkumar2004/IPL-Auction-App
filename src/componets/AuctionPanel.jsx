// src/components/AuctionPanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuctionPanel({
  player,
  timer,
  highestBidder,
  currentBid,
  onConfirm,
  onSkip,
  onRestart,
  onStart,
  auctionStarted,
}) {
  if (!player) return <div className="auction-panel">No player selected</div>;

  const isLowTime = timer <= 3;

  return (
    <motion.div
      key={player?.id || "no-player"}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: "#0a1d4c",
        color: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 0 25px rgba(0,0,0,0.4)",
        border: "2px solid rgba(255,255,255,0.15)",
        textAlign: "center",
        minHeight: "360px",
      }}
    >
      <h2 style={{ color: "gold", marginBottom: "10px" }}>🏏 Auction Panel</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={player.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* If auction has not started yet */}
          {!auctionStarted ? (
            <>
              <h3 style={{ fontSize: "1.4rem", color: "#fff" }}>
                Welcome to the IPL Auction!
              </h3>
              <p style={{ color: "#bbb" }}>Click below to begin the player auction.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginTop: "20px",
                  boxShadow: "0 0 10px rgba(40,167,69,0.4)",
                }}
              >
                🚀 Start Auction
              </motion.button>
            </>
          ) : (
            <>
              {/* PLAYER INFO */}
              <h3 style={{ fontSize: "1.5rem", color: "#fff" }}>
                {player.name}{" "}
                {player.isForeign && (
                  <span title="Foreign Player" style={{ marginLeft: 6, color: "#ffd94d" }}>
                    ✈️
                  </span>
                )}
              </h3>

              {player.country && (
                <p style={{ fontStyle: "italic", color: "#bbb", marginTop: "-6px" }}>
                  {player.country}
                </p>
              )}

              <p style={{ color: "#bbb" }}>Role: {player.role}</p>
              <p style={{ color: "#bbb" }}>Base Price: ₹{player.basePrice}</p>

              {/* STATUS */}
              {player.soldTo ? (
                <p
                  style={{
                    color: "lime",
                    fontWeight: "bold",
                    marginTop: 15,
                    fontSize: "1rem",
                  }}
                >
                  ✅ Sold to {player.soldTo} for ₹{player.price}
                </p>
              ) : player.unsold ? (
                <p
                  style={{
                    color: "tomato",
                    fontWeight: "bold",
                    marginTop: 15,
                    fontSize: "1rem",
                  }}
                >
                  ❌ Unsold
                </p>
              ) : (
                <>
                  {/* Bidding Info */}
                  <p
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: highestBidder ? "gold" : "#ccc",
                    }}
                  >
                    {highestBidder
                      ? `Highest Bid: ${highestBidder} – ₹${currentBid}`
                      : "No bids yet"}
                  </p>

                  {/* Timer */}
                  <motion.p
                    animate={{
                      color: isLowTime
                        ? ["#ff6b6b", "#ff9f1c", "#ff6b6b"]
                        : ["#fff"],
                      scale: isLowTime ? [1, 1.15, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: isLowTime ? Infinity : 0,
                    }}
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    ⏳ Time Left: {timer}s
                  </motion.p>

                  {/* BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "12px",
                      marginTop: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={onConfirm}
                      style={{
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ✅ Confirm Sale
                    </button>

                    <button
                      onClick={onSkip}
                      style={{
                        background: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      ❌ Mark Unsold
                    </button>

                    <button
                      onClick={onRestart}
                      style={{
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      🔄 Restart Auction
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}