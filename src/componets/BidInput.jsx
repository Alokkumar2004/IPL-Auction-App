import React, { useRef } from 'react';

/*
Simple helper input allowing manual entry of teamId and amount.
This is optional: normally teams bid via TeamCard controls.
*/
export default function BidInput({ onBid, min }){
  const teamRef = useRef();
  const amountRef = useRef();

  function doBid(){
    const teamId = teamRef.current.value.trim();
    const amt = Number(amountRef.current.value);
    if (!teamId) return alert('Enter team id');
    if (!amt || amt < min) return alert(`Enter amount ≥ ₹${min}`);
    onBid(teamId, amt);
    amountRef.current.value = '';
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input ref={teamRef} placeholder="team id (e.g. team1)" />
      <input ref={amountRef} placeholder={`amount (min ₹${min})`} type="number" />
      <button onClick={doBid}>Place Bid</button>
    </div>
  );
}