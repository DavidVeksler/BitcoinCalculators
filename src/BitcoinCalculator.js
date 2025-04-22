// https://claude.site/artifacts/d8f75bf2-9325-404c-9856-6ede722b0694

import React, { useState } from "react";

const BitcoinExclusivityCalculator = () => {
  const [balance, setBalance] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showGlobal, setShowGlobal] = useState(false);

  const MAX_BITCOIN_SUPPLY = 21000000;
  const LARGEST_KNOWN_HOLDING = 1100000;
  const TOTAL_ADDRESSES = 100000000;
  const GLOBAL_POPULATION = 8000000000;

  // Market cap scenarios (in USD)
  const MARKET_SCENARIOS = {
    CURRENT: {
      cap: 1000000000000, // $1T
      name: "Current Bitcoin Market Cap",
    },
    GOLD: {
      cap: 13500000000000, // $13.5T
      name: "Gold Market Cap",
    },
    CURRENCIES: {
      cap: 80000000000000, // $80T
      name: "All Currencies",
    },
    GLOBAL_WEALTH: {
      cap: 500000000000000, // $500T
      name: "Global Wealth",
    },
  };

  const formatUSD = (amount) => {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;

    if (amount >= trillion) {
      return `$${(amount / trillion).toFixed(2)}T`;
    } else if (amount >= billion) {
      return `$${(amount / billion).toFixed(2)}B`;
    } else if (amount >= million) {
      return `$${(amount / million).toFixed(2)}M`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const calculateValueInScenario = (btc, marketCap) => {
    const pricePerBTC = marketCap / MAX_BITCOIN_SUPPLY;
    return btc * pricePerBTC;
  };

  const calculateExclusivity = (btc, isGlobal) => {
    if (btc > MAX_BITCOIN_SUPPLY) return null;

    const base = isGlobal ? GLOBAL_POPULATION : TOTAL_ADDRESSES;
    let holdersAbove;

    if (btc <= 0) {
      holdersAbove = base;
    } else if (btc < 0.1) {
      holdersAbove = base * 0.08;
    } else if (btc < 1) {
      holdersAbove = base * 0.015;
    } else if (btc < 10) {
      holdersAbove = base * 0.0025;
    } else if (btc < 100) {
      holdersAbove = base * 0.000003;
    } else if (btc < 1000) {
      holdersAbove = isGlobal ? base * 0.0000005 : 1678;
    } else if (btc < 10000) {
      holdersAbove = isGlobal ? base * 0.0000001 : 85;
    } else if (btc < 100000) {
      holdersAbove = isGlobal ? base * 0.00000001 : 5;
    } else if (btc <= LARGEST_KNOWN_HOLDING) {
      holdersAbove = isGlobal ? base * 0.0000000001 : 1;
    } else {
      return 0;
    }

    return Math.round(holdersAbove);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBalance(value);
    setError("");

    const btc = parseFloat(value);
    if (!isNaN(btc) && btc >= 0) {
      if (btc > MAX_BITCOIN_SUPPLY) {
        setError(
          `Invalid amount: exceeds maximum Bitcoin supply of ${MAX_BITCOIN_SUPPLY.toLocaleString()} BTC`
        );
        setResult(null);
      } else if (btc > LARGEST_KNOWN_HOLDING) {
        setError(
          `No known addresses hold more than ${LARGEST_KNOWN_HOLDING.toLocaleString()} BTC`
        );
        setResult(0);
      } else {
        const numHolders = calculateExclusivity(btc, showGlobal);
        setResult(numHolders);
      }
    } else {
      setResult(null);
    }
  };

  return (
    <div className="font-sans p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Bitcoin Exclusivity Calculator
      </h2>

      <div className="mb-4 flex items-center space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            !showGlobal ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setShowGlobal(false);
            if (balance) handleChange({ target: { value: balance } });
          }}
        >
          Current Distribution
        </button>
        <button
          className={`px-4 py-2 rounded ${
            showGlobal ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setShowGlobal(true);
            if (balance) handleChange({ target: { value: balance } });
          }}
        >
          Global Population
        </button>
      </div>

      <p className="mb-3">Enter your Bitcoin balance (in BTC):</p>
      <input
        type="number"
        value={balance}
        onChange={handleChange}
        placeholder="e.g., 1.5"
        className="p-2 text-lg border rounded w-full mb-4"
        min="0"
        step="any"
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded text-red-700">{error}</div>
      )}

      {result !== null && !error && balance > 0 && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-lg">
              {showGlobal ? (
                <>
                  If Bitcoin was distributed among all{" "}
                  {(GLOBAL_POPULATION / 1e9).toFixed(1)} billion people in the
                  same ratio as current holders,{" "}
                </>
              ) : (
                <>Currently, </>
              )}
              <span className="font-bold">{result.toLocaleString()}</span>{" "}
              {showGlobal ? "people" : "addresses"} would have{" "}
              <strong>at least</strong> {balance} BTC
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <p className="font-bold mb-2">
              Value of {balance} BTC in different scenarios:
            </p>
            <div className="space-y-2">
              {Object.entries(MARKET_SCENARIOS).map(([key, scenario]) => (
                <div key={key} className="flex justify-between">
                  <span>{scenario.name}:</span>
                  <span className="font-mono">
                    {formatUSD(
                      calculateValueInScenario(
                        parseFloat(balance),
                        scenario.cap
                      )
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-sm mt-4 text-gray-600">
        Note:{" "}
        {showGlobal
          ? "This is a hypothetical calculation based on current Bitcoin distribution patterns applied to global population."
          : "These estimates are based on February 2025 blockchain analysis. Value calculations assume even distribution of market cap across all BTC."}
      </p>
    </div>
  );
};

export default BitcoinExclusivityCalculator;
