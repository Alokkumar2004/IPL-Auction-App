// src/components/PlayerList.jsx
import React, { useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import "../index.css";

/**
 * PlayerList Component
 * - Auto-scrolls current player to top
 * - Shows sold/unsold/awaiting status
 * - Marks foreign players with airplane ✈️
 * - Displays country flag or name next to player
 */
export default function PlayerList({ players = [], currentIdx = 0 }) {
  const containerRef = useRef(null);
  const currentPlayerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const current = currentPlayerRef.current;
    if (!container || !current) return;

    if (currentIdx < 0 || currentIdx >= players.length) return;

    const doScroll = () => {
      try {
        const containerRect = container.getBoundingClientRect();
        const currentRect = current.getBoundingClientRect();
        const offsetInside = currentRect.top - containerRect.top;
        const targetScrollTop = Math.max(0, container.scrollTop + offsetInside - 8);

        if (Math.abs(container.scrollTop - targetScrollTop) > 2) {
          container.scrollTo({ top: targetScrollTop, behavior: "smooth" });
        }
      } catch (err) {
        try {
          current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        } catch {}
      }
    };

    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => {
        doScroll();
        cancelAnimationFrame(raf2);
      });
      cancelAnimationFrame(raf1);
    });

    return () => cancelAnimationFrame(raf1);
  }, [currentIdx, players]);

  return (
    <div ref={containerRef} className="player-scroll" aria-label="Player list">
      {players.map((player, idx) => {
        const isCurrent = idx === currentIdx;
        let statusClass = "awaiting";
        if (player.soldTo) statusClass = "sold";
        else if (player.unsold) statusClass = "unsold";

        return (
          <motion.div
            key={player.id ?? idx}
            ref={isCurrent ? currentPlayerRef : null}
            whileHover={{ scale: 1.03, boxShadow: "0 0 12px rgba(255,215,0,0.25)" }}
            className={`player-card ${isCurrent ? "current" : ""}`}
          >
            {/* Player Image */}
            {player.image && (
              <img
                src={player.image}
                alt={player.name}
                className="player-image"
                style={{ border: isCurrent ? "2px solid #ffd700" : "1px solid #fff" }}
              />
            )}

            {/* Player Name + Foreign Icon + Country */}
            <h4>
              {player.name}{" "}
              {player.isForeign && (
                <span title="Foreign Player" style={{ marginLeft: 6, color: "#ffd94d" }}>
                  ✈️
                </span>
              )}
            </h4>
            {player.country && (
              <p style={{ fontStyle: "italic", color: "#ddd", marginTop: "-6px" }}>
                {player.country}
              </p>
            )}

            {/* Role & Base Price */}
            <p>Role: {player.role}</p>
            <p>Base: ₹{player.basePrice}</p>

            {/* Auction Status */}
            {statusClass === "sold" && <p className="sold">✅ Sold to {player.soldTo}</p>}
            {statusClass === "unsold" && <p className="unsold">❌ Unsold</p>}
            {statusClass === "awaiting" && <p className="awaiting">⏳ Awaiting Auction</p>}
          </motion.div>
        );
      })}
    </div>
  );
}