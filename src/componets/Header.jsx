import React from 'react';

export default function Header({ onRestart }){
  return (
    <header className="header card">
      <h1>IPL Auction Demo</h1>
      <div>
        <button onClick={onRestart}>Restart Full Auction</button>
      </div>
    </header>
  );
}