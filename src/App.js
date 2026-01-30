// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import TeamList from "./componets/TeamList";
import PlayerList from "./componets/PlayerList";
import AuctionPanel from "./componets/AuctionPanel";
import { motion, AnimatePresence } from "framer-motion";
import SamplePlayers from "./data/SamplePlayers";

const MAX_PLAYERS_PER_TEAM = 13;

export default function App() {
  const [round, setRound] = useState("main");
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAuctionEnded, setShowAuctionEnded] = useState(false);

  const [players, setPlayers] = useState(
    SamplePlayers.map((p) => ({ ...p, soldTo: null, unsold: false, price: null }))
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(players[0]);
  const [currentBid, setCurrentBid] = useState(players[0]?.basePrice || 0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [timer, setTimer] = useState(10);
  const [isAuctionActive, setIsAuctionActive] = useState(false);
  const [auctionStarted, setAuctionStarted] = useState(false);

  const [teams, setTeams] = useState([
    { id: "CSK", name: "CSK", purse: 1000, players: [], logo: "/logos/csklogo.jpg" },
    { id: "MI", name: "MI", purse: 1000, players: [], logo: "/logos/milogo.jpg" },
    { id: "RCB", name: "RCB", purse: 1000, players: [], logo: "/logos/rcblogo.jpg" },
    { id: "KKR", name: "KKR", purse: 1000, players: [], logo: "/logos/kkrlogo.jpg" },
    { id: "RR", name: "RR", purse: 1000, players: [], logo: "/logos/rrlogo.jpg" },
    { id: "DC", name: "DC", purse: 1000, players: [], logo: "/logos/dclogo.jpg" },
    { id: "PBKS", name: "PBKS", purse: 1000, players: [], logo: "/logos/pbsklogo.jpg" },
    { id: "GT", name: "GT", purse: 1000, players: [], logo: "/logos/gtlogo.jpg" },
    { id: "SRH", name: "SRH", purse: 1000, players: [], logo: "/logos/srhlogo.jpg" },
    { id: "LSG", name: "LSG", purse: 1000, players: [], logo: "/logos/lsglogo.jpg" },
  ]);

  const setCurrentToIndex = useCallback(
    (i, playersArr = players) => {
      const p = playersArr[i] || null;
      setCurrentIdx(i);
      setCurrentPlayer(p);
      setCurrentBid(p ? p.basePrice : 0);
      setHighestBidder(null);
      setTimer(10);
      setIsAuctionActive(true);
    },
    [players]
  );

  const startAuction = () => {
    if (auctionStarted) return;
    setAuctionStarted(true);
    setIsAuctionActive(true);
    setTimer(10);
  };

  const moveToNextPlayer = useCallback(() => {
    if (currentIdx < players.length - 1) {
      setCurrentToIndex(currentIdx + 1);
      return;
    }

    if (round === "main") {
      const unsoldList = players.filter((p) => !p.soldTo).map((p) => ({ ...p, unsold: false }));
      if (unsoldList.length > 0) {
        setShowRoundTransition(true);
        setTimeout(() => {
          setPlayers(unsoldList.map((p) => ({ ...p, soldTo: null, price: null, unsold: false })));
          setRound("unsold");
          setShowRoundTransition(false);
          setCurrentToIndex(0, unsoldList);
        }, 1800);
      } else {
        setAuctionEnded(true);
        setIsAuctionActive(false);
        setShowAuctionEnded(true);
      }
    } else {
      setAuctionEnded(true);
      setIsAuctionActive(false);
      setShowAuctionEnded(true);
    }
  }, [currentIdx, players, round, setCurrentToIndex]);

  const confirmSale = useCallback(() => {
    if (!highestBidder) return;
    const winningTeam = teams.find((t) => t.id === highestBidder);
    if (!winningTeam) return;

    if (winningTeam.players.length >= MAX_PLAYERS_PER_TEAM) {
      alert(`${winningTeam.name} already has ${MAX_PLAYERS_PER_TEAM} players!`);
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentIdx] = {
      ...updatedPlayers[currentIdx],
      soldTo: highestBidder,
      price: currentBid,
      unsold: false,
    };
    setPlayers(updatedPlayers);

    const updatedTeams = teams.map((team) =>
      team.id === highestBidder
        ? {
            ...team,
            purse: team.purse - currentBid,
            players: [...team.players, updatedPlayers[currentIdx]],
          }
        : team
    );
    setTeams(updatedTeams);
    moveToNextPlayer();
  }, [highestBidder, teams, players, currentIdx, currentBid, moveToNextPlayer]);

  const markUnsold = useCallback(() => {
    const updated = [...players];
    updated[currentIdx] = { ...updated[currentIdx], unsold: true };
    setPlayers(updated);
    moveToNextPlayer();
  }, [players, currentIdx, moveToNextPlayer]);

  const handleBid = (teamId, bidAmount) => {
    if (!isAuctionActive || !auctionStarted) return;
    const nextBid = typeof bidAmount === "number" ? bidAmount : currentBid + 2;
    if (highestBidder === teamId) return;
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    if (nextBid > team.purse) {
      alert(`${team.name} doesn't have enough funds to bid ₹${nextBid}`);
      return;
    }
    setCurrentBid(nextBid);
    setHighestBidder(teamId);
    setTimer(12);
  };

  const restartAuction = () => {
    const resetPlayers = SamplePlayers.map((p) => ({ ...p, soldTo: null, unsold: false, price: null }));
    setPlayers(resetPlayers);
    setRound("main");
    setCurrentIdx(0);
    setCurrentPlayer(resetPlayers[0]);
    setCurrentBid(resetPlayers[0].basePrice);
    setTimer(10);
    setIsAuctionActive(false);
    setHighestBidder(null);
    setAuctionStarted(false);
    setAuctionEnded(false);
    setShowStats(false);
    setShowAuctionEnded(false);
    setTeams((prev) => prev.map((t) => ({ ...t, purse: 1000, players: [] })));
  };

  useEffect(() => {
    if (!isAuctionActive || !auctionStarted || timer <= 0) return;
    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [isAuctionActive, auctionStarted, timer]);

  useEffect(() => {
    if (timer === 0 && isAuctionActive && auctionStarted) {
      setIsAuctionActive(false);
      if (highestBidder) confirmSale();
      else markUnsold();
    }
  }, [timer, isAuctionActive, auctionStarted, highestBidder, confirmSale, markUnsold]);

  useEffect(() => {
    setCurrentPlayer(players[currentIdx] || null);
    setCurrentBid((players[currentIdx] && players[currentIdx].basePrice) || 0);
    setHighestBidder(null);
  }, [players, currentIdx]);

  return (
    <div className="app">
      {/* LEFT */}
      <div className="left-column">
        <h2 style={{ textAlign: "center", color: "#ffd94d" }}>
          Player List ({round === "main" ? "Main Auction" : "Unsold Round"})
        </h2>
        <PlayerList players={players} currentIdx={currentIdx} />
      </div>

      {/* CENTER */}
      <div className="center-column">
        <div className="center-inner">
          <div className="auction-panel card">
            <AuctionPanel
              player={currentPlayer}
              timer={timer}
              round={round}
              highestBidder={highestBidder}
              currentBid={currentBid}
              onConfirm={confirmSale}
              onSkip={markUnsold}
              onStart={startAuction}
              onRestart={restartAuction}
              auctionStarted={auctionStarted}
            />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-column">
        <h2 style={{ textAlign: "center", color: "#ffd94d" }}>Teams</h2>
        <TeamList
          teams={teams}
          onBid={handleBid}
          highestBidder={highestBidder}
          currentBid={currentBid}
          basePrice={currentPlayer?.basePrice}
        />
      </div>

      {/* ROUND TRANSITION */}
      <AnimatePresence>
        {showRoundTransition && (
          <motion.div
            key="round-banner"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              color: "#FFD700",
              fontSize: "2rem",
              fontWeight: "bold",
              textShadow: "0 0 20px #ffcf40",
            }}
          >
            🏆 Unsold Player Auction Starting...
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUCTION ENDED */}
<AnimatePresence>
  {showAuctionEnded && !showStats && (
    <motion.div
      key="auction-ended"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="auction-ended-banner"
      style={{ 
        background: "#041124"  // full opaque dark background
      }}
    >
      🏆 Auction Ended!
      <div style={{ marginTop: 30, display: "flex", gap: 20 }}>
        <button className="btn-stats" onClick={() => setShowStats(true)}>
          Show Team Stats
        </button>
        <button className="btn-restart" onClick={restartAuction}>
          Restart Auction
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

         {/* TEAM STATS MODAL */}
<AnimatePresence>
  {showStats && (
    <motion.div
      key="team-stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#041124", // Fully solid background
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
        overflow: "hidden", // no scroll
      }}
    >
      {/* Floating Close Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowStats(false)}
        style={{
          position: "absolute",
          top: 20,
          right: 45,
          width: 45,
          height: 45,
          borderRadius: "50%",
          border: "none",
          background: "#ff4d4d",
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 2000,
          boxShadow: "0 0 12px rgba(255,255,255,0.6)",
        }}
      >
        ✕
      </motion.button>

      <h2
        style={{
          marginBottom: 10,
          color: "#FFD700",
          textAlign: "center",
          fontSize: "2rem",
        }}
      >
        🏟 Team Stats
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)", // ✅ 5 per row
          gridTemplateRows: "repeat(2, 1fr)", // ✅ 2 rows
          gap: 15,
          width: "100%",
          maxWidth: "1400px",
          height: "70%", // fits screen height
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {teams.map((team) => {
          const maxPrice = Math.max(...team.players.map((p) => p.price || 0));
          return (
            <div
              key={team.id}
              style={{
                background: "#0a1d4c",
                padding: 10,
                borderRadius: 10,
                width: "90%",
                maxWidth: 220,
                height: "100%",
                maxHeight: 230,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <img
                src={team.logo}
                alt={team.name}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginBottom: 6,
                  objectFit: "cover",
                  background: "#fff",
                }}
              />
              <h3 style={{ color: "#ffd94d", margin: "4px 0", fontSize: "1rem" }}>
                {team.name}
              </h3>
              <p style={{ margin: "2px 0", fontSize: "0.85rem" }}>
                Purse: ₹{team.purse}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "0.75rem",
                  maxHeight: 80,
                  overflowY: "auto",
                  width: "100%",
                }}
              >
                {team.players.length > 0 ? (
                  team.players.map((p, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontWeight: p.price === maxPrice ? "bold" : "normal",
                        color: p.price === maxPrice ? "#ffd94d" : "#fff",
                      }}
                    >
                      {p.name} - ₹{p.price}
                    </li>
                  ))
                ) : (
                  <li style={{ color: "#ccc" }}>None</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}