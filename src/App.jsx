import { useCallback, useEffect, useMemo, useState } from "react";

import LegalPages from "./LegalPages.jsx";

import "./App.css";
import "./mobile-responsive.css";

const API_URL = import.meta.env.VITE_API_URL;

const DISCLAIMER_TEXT =
  "This portfolio is maintained for personal journaling and informational purposes only and does not constitute investment advice or a recommendation to buy, sell, or hold any security. Current prices and other market data may be delayed, inaccurate, incomplete, or unavailable. Displayed returns are indicative only and may not reflect actual realised or unrealised profit or loss, including the effects of transaction quantities, fees, taxes, and currency conversion. Information is provided on an 'as is' basis without any guarantee of accuracy or completeness. Any investment decision is solely your responsibility, and the portfolio owner accepts no liability for losses or damages arising from the use of this information.";

const SUBSCRIPTION_TEXT =
  "Subscribe with your email address to join the journal's mailing list and receive updates, if and when they are shared. Submission of your email address does not guarantee that updates will be sent or that any particular frequency of communication will be maintained. Your email address will be used for this purpose only.";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    day: "2-digit",

    month: "short",

    year: "numeric",

    timeZone: "UTC",
  });
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return number.toLocaleString("en-US", {
    style: "currency",

    currency: "USD",

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  });
}

function numericValue(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function formatPercent(value) {
  const number = numericValue(value);

  if (number === null) return "—";

  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
}

function getReturnClass(value) {
  const number = numericValue(value);

  if (number === null || number === 0) return "neutral";

  return number > 0 ? "positive" : "negative";
}

function calculateHoldingDays(buyDate, endDate) {
  if (!buyDate) return null;

  const start = new Date(buyDate);

  const end = endDate ? new Date(endDate) : new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 86400000));
}

function getHoldingDays(trade, isPastTrade) {
  const suppliedDays = numericValue(trade.holdingDays);

  if (suppliedDays !== null) return suppliedDays;

  return calculateHoldingDays(
    trade.buyDate,

    isPastTrade ? trade.sellDate : null,
  );
}

function StatCard({ label, value, subtitle }) {
  return (
    <article className="stat-card">
      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      {subtitle && <div className="stat-sub">{subtitle}</div>}
    </article>
  );
}

function TradeTable({ trades, type }) {
  const isPastTrade = type === "past";

  const [sortBy, setSortBy] = useState(isPastTrade ? "sellDate" : "buyDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const filteredTrades = useMemo(() => {
    const query = search.trim().toLowerCase();

    return trades.filter((trade) => {
      if (!query) return true;

      return [
        trade.symbol,
        trade.name,
        trade.comments,
        trade.buyDate,
        trade.sellDate,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [trades, search]);

  const sortedTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        [
          "buyPrice",
          "sellPrice",
          "cmp",
          "profitLossPercent",
          "holdingDays",
        ].includes(sortBy)
      ) {
        aValue = numericValue(aValue) ?? -Infinity;
        bValue = numericValue(bValue) ?? -Infinity;
      } else {
        aValue = aValue ? String(aValue).toLowerCase() : "";
        bValue = bValue ? String(bValue).toLowerCase() : "";
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTrades, sortBy, sortOrder]);

  const changeSort = (column) => {
    if (sortBy === column) {
      setSortOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder(["symbol", "name"].includes(column) ? "asc" : "desc");
    }
  };

  const sortIndicator = (column) => {
    if (sortBy !== column) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const heading = (label, column) => (
    <th
      key={column}
      aria-sort={
        sortBy === column
          ? sortOrder === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        type="button"
        className="sort-button"
        onClick={() => changeSort(column)}
      >
        {label}
        {sortIndicator(column)}
      </button>
    </th>
  );

  const renderReturn = (trade) => (
    <span className={`return-value ${getReturnClass(trade.profitLossPercent)}`}>
      {formatPercent(trade.profitLossPercent)}
    </span>
  );

  const renderMobileCard = (trade, index) => (
    <article
      className="mobile-trade-card"
      key={`${trade.symbol || "stock"}-${trade.buyDate || ""}-${index}`}
    >
      <div className="mobile-trade-card-top">
        <div className="mobile-stock-identity">
          <div className="mobile-stock-avatar" aria-hidden="true">
            {(trade.symbol || "?").slice(0, 1).toUpperCase()}
          </div>

          <div className="mobile-stock-info">
            <strong>{trade.symbol || "—"}</strong>
            {trade.name && <span>{trade.name}</span>}
            <small>{isPastTrade ? "Closed position" : "Active position"}</small>
          </div>
        </div>

        <div className="mobile-return-block">
          <span className="mobile-field-label">
            {isPastTrade ? "TRADE RETURN" : "NOTIONAL RETURN"}
          </span>
          {renderReturn(trade)}
        </div>
      </div>

      <div className="mobile-trade-metrics">
        <div className="mobile-trade-metric">
          <span className="mobile-field-label">BUY</span>
          <strong>{formatPrice(trade.buyPrice)}</strong>
          <small>{formatDate(trade.buyDate)}</small>
        </div>

        <div className="mobile-trade-metric">
          <span className="mobile-field-label">
            {isPastTrade ? "SELL" : "CURRENT"}
          </span>
          <strong>
            {formatPrice(isPastTrade ? trade.sellPrice : trade.cmp)}
          </strong>
          <small>
            {isPastTrade ? formatDate(trade.sellDate) : "Latest price"}
          </small>
        </div>

        <div className="mobile-trade-metric mobile-holding-metric">
          <span className="mobile-field-label">HOLDING</span>
          <strong>{getHoldingDays(trade, isPastTrade) ?? "—"}d</strong>
          <small>period</small>
        </div>
      </div>

      {trade.comments && (
        <details className="mobile-trade-comment">
          <summary>View note</summary>
          <p>{trade.comments}</p>
        </details>
      )}
    </article>
  );

  return (
    <div className="trade-table-container">
      <div className="table-toolbar">
        <span className="table-count">
          {sortedTrades.length} {sortedTrades.length === 1 ? "trade" : "trades"}
        </span>

        <input
          type="search"
          className="table-search"
          placeholder="Search symbol or stock..."
          aria-label="Search trades"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {sortedTrades.length === 0 ? (
        <div className="empty-state mobile-empty-state">
          {search ? "No matching trades found." : "No trades available."}
        </div>
      ) : (
        <>
          <div className="mobile-trade-list">
            {sortedTrades.map(renderMobileCard)}
          </div>

          <div className="table-wrapper desktop-trade-table">
            <table className="trade-table">
              <thead>
                <tr>
                  {heading("Stock", "symbol")}
                  {heading("Buy Date", "buyDate")}
                  {heading("Buy Price", "buyPrice")}
                  {isPastTrade
                    ? heading("Sell Date", "sellDate")
                    : heading("Current Price", "cmp")}
                  {isPastTrade && heading("Sell Price", "sellPrice")}
                  {heading(
                    isPastTrade ? "Return %" : "Notional Return %",
                    "profitLossPercent",
                  )}
                  {heading("Holding Days", "holdingDays")}
                </tr>
              </thead>

              <tbody>
                {sortedTrades.map((trade, index) => (
                  <tr
                    key={`${trade.symbol || "stock"}-${trade.buyDate || ""}-${index}`}
                  >
                    <td>
                      <div className="stock-cell">
                        <strong>{trade.symbol || "—"}</strong>
                        {trade.name && (
                          <span className="stock-name">{trade.name}</span>
                        )}
                        {!isPastTrade && (
                          <span className="active-badge">Active</span>
                        )}
                        {trade.comments && (
                          <span className="trade-comment">
                            {trade.comments}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(trade.buyDate)}</td>
                    <td className="price-cell">
                      {formatPrice(trade.buyPrice)}
                    </td>
                    {isPastTrade ? (
                      <>
                        <td>{formatDate(trade.sellDate)}</td>
                        <td className="price-cell">
                          {formatPrice(trade.sellPrice)}
                        </td>
                      </>
                    ) : (
                      <td className="price-cell">{formatPrice(trade.cmp)}</td>
                    )}
                    <td>{renderReturn(trade)}</td>
                    <td>{getHoldingDays(trade, isPastTrade) ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PortfolioHome() {
  const [activeTrades, setActiveTrades] = useState([]);

  const [pastTrades, setPastTrades] = useState([]);

  const [updatedAt, setUpdatedAt] = useState(null);

  const [subscriberCount, setSubscriberCount] = useState(null);

  const [activeTab, setActiveTab] = useState("active");

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [email, setEmail] = useState("");

  const [isSubscribing, setIsSubscribing] = useState(false);

  const [subscribeStatus, setSubscribeStatus] = useState({
    type: "",

    message: "",
  });

  const loadPortfolio = useCallback(async () => {
    if (!API_URL) {
      setLoadError(
        "The API URL is not configured. Check your VITE_API_URL environment variable.",
      );

      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    setLoadError("");

    try {
      const url = new URL(API_URL);

      url.searchParams.set("action", "fetchUS");

      url.searchParams.set("_", String(Date.now()));

      const response = await fetch(url.toString(), {
        method: "GET",

        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load portfolio data.");
      }

      const result = await response.json();

      if (result.success === false) {
        throw new Error(
          result.message || "The portfolio API returned an error.",
        );
      }

      setActiveTrades(
        Array.isArray(result.activeTrades) ? result.activeTrades : [],
      );

      setPastTrades(Array.isArray(result.pastTrades) ? result.pastTrades : []);

      setSubscriberCount(
        Number.isFinite(Number(result.subscribers))
          ? Number(result.subscribers)
          : null,
      );

      setUpdatedAt(result.updatedAt || null);
    } catch (error) {
      console.error("Portfolio loading error:", error);

      setLoadError(
        error.message || "Unable to load portfolio data. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  const profitableTrades = pastTrades.filter(
    (trade) => (numericValue(trade.profitLossPercent) ?? 0) > 0,
  ).length;

  const hitRate =
    pastTrades.length > 0 ? (profitableTrades / pastTrades.length) * 100 : null;

  const holdingDaysValues = pastTrades

    .map((trade) => getHoldingDays(trade, true))

    .filter((days) => days !== null && Number.isFinite(days));

  const averageHoldingDays =
    holdingDaysValues.length > 0
      ? holdingDaysValues.reduce((sum, days) => sum + days, 0) /
        holdingDaysValues.length
      : null;

  const activeTabTrades = activeTab === "active" ? activeTrades : pastTrades;

  const handleSubscribe = async (event) => {
    event.preventDefault();

    const emailAddress = email.trim().toLowerCase();

    if (!emailAddress) {
      setSubscribeStatus({
        type: "error",

        message: "Please enter your email address.",
      });

      return;
    }

    if (!API_URL) {
      setSubscribeStatus({
        type: "error",

        message: "The subscription service is not configured.",
      });

      return;
    }

    setIsSubscribing(true);

    setSubscribeStatus({ type: "", message: "" });

    try {
      const separator = API_URL.includes("?") ? "&" : "?";

      const response = await fetch(`${API_URL}${separator}action=subscribe`, {
        method: "POST",

        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },

        body: JSON.stringify({ emailAddress }),
      });

      if (!response.ok) {
        throw new Error("The subscription request failed. Please try again.");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Unable to subscribe. Please try again.",
        );
      }

      setSubscribeStatus({
        type: "success",

        message: result.message || "You're subscribed successfully!",
      });

      if (!result.alreadySubscribed) {
        setSubscriberCount((count) => (count === null ? count : count + 1));
      }

      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);

      setSubscribeStatus({
        type: "error",

        message: "We couldn't confirm your subscription. Please try again.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="app-container">
      <header className="site-header">
        <a className="brand" href="#/" aria-label="US Equity Journal home">
          <span className="brand-icon">↗</span>

          <span>
            <strong>FundLens · US Equity Journal</strong>

            <small>Personal Tracker</small>
          </span>
        </a>

        <button
          type="button"
          className="refresh-button"
          onClick={loadPortfolio}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "↻ Refresh"}
        </button>
      </header>

      <main>
        <section className="hero-section" id="portfolio">
          <div>
            <span className="eyebrow">PORTFOLIO · US EQUITIES</span>

            <h1>Trading journey, one trade at a time.</h1>

            <p>
              A personal journal of current holdings, past trades, and
              percentage returns.
            </p>
          </div>

          <div className="hero-note">
            <span className="hero-note-icon">◉</span>

            <div>
              <strong>Personal investment journal</strong>

              <p>
                For informational purposes only. This is not investment advice.
              </p>
            </div>
          </div>
        </section>

        {loadError && (
          <div className="error-banner" role="alert">
            <span>{loadError}</span>

            <button type="button" onClick={loadPortfolio}>
              Retry
            </button>
          </div>
        )}

        <section className="stats-grid" aria-label="Portfolio statistics">
          <StatCard
            label="Active Holdings"
            value={
              isLoading && activeTrades.length === 0 ? "—" : activeTrades.length
            }
            subtitle="Currently open positions"
          />

          <StatCard
            label="Closed Trades"
            value={
              isLoading && pastTrades.length === 0 ? "—" : pastTrades.length
            }
            subtitle="Past positions"
          />

          <StatCard
            label="Hit Rate"
            value={hitRate === null ? "—" : `${hitRate.toFixed(1)}%`}
            subtitle={`${profitableTrades} of ${pastTrades.length} profitable trades`}
          />

          <StatCard
            label="Avg Holding Days"
            value={
              averageHoldingDays === null
                ? "—"
                : `${averageHoldingDays.toFixed(1)} days`
            }
            subtitle="Across closed trades with holding-day data"
          />
        </section>

        <section className="section-card" id="journal">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TRADE JOURNAL</span>

              <h2>Positions and trade history</h2>

              <p>Select a view, search your trades, or sort by any column.</p>
            </div>

            <span className="updated-label">
              {updatedAt
                ? `Updated ${formatDate(updatedAt)}`
                : "Portfolio overview"}
            </span>
          </div>

          <div className="trade-tabs" role="tablist" aria-label="Trade type">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "active"}
              className={activeTab === "active" ? "active" : ""}
              onClick={() => setActiveTab("active")}
            >
              Active Holdings ({activeTrades.length})
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "past"}
              className={activeTab === "past" ? "active" : ""}
              onClick={() => setActiveTab("past")}
            >
              Closed Trades ({pastTrades.length})
            </button>
          </div>

          {isLoading && activeTabTrades.length === 0 ? (
            <div className="loading-state" role="status">
              <span className="loading-spinner" />
              Loading your portfolio...
            </div>
          ) : (
            <TradeTable
              key={activeTab}
              trades={activeTabTrades}
              type={activeTab}
            />
          )}

          <p className="returns-note">
            Notional returns are indicative and may not reflect actual realised
            or unrealised returns after transaction quantities, fees, taxes, or
            currency conversion. Current prices may be delayed or incorrect.
          </p>
        </section>

        <section className="subscribe-section" id="subscribe">
          <div className="subscribe-copy">
            <span className="eyebrow">FOLLOW THE JOURNAL</span>

            <h2>Stay connected to my investing journey.</h2>

            <p>
              Join the journal's subscriber list to be included for potential
              future updates. Submission of your email address does not
              guarantee that updates will be sent or that any particular
              frequency of communication will be maintained. Your email address
              will be used for this purpose only.
            </p>

            {subscriberCount !== null && (
              <div className="subscriber-count" aria-live="polite">
                <span className="subscriber-count-icon" aria-hidden="true">
                  ✦
                </span>

                <span>
                  <strong>{subscriberCount.toLocaleString("en-IN")}</strong>{" "}
                  subscribers so far
                </span>
              </div>
            )}
          </div>

          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <label htmlFor="subscriber-email">Email address</label>

            <div className="subscribe-input-group">
              <input
                id="subscriber-email"
                name="emailAddress"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (subscribeStatus.message) {
                    setSubscribeStatus({
                      type: "",

                      message: "",
                    });
                  }
                }}
                required
                maxLength={254}
                disabled={isSubscribing}
              />

              <button type="submit" disabled={isSubscribing}>
                {isSubscribing ? "Submitting..." : "Subscribe →"}
              </button>
            </div>

            {subscribeStatus.message && (
              <p
                className={`subscribe-message ${subscribeStatus.type}`}
                role="status"
                aria-live="polite"
              >
                {subscribeStatus.message}
              </p>
            )}

            <p className="subscribe-disclaimer">{SUBSCRIPTION_TEXT}</p>
          </form>
        </section>

        <button
          type="button"
          className="floating-subscribe-button"
          aria-label="Jump to email subscription form"
          onClick={() => {
            document.getElementById("subscribe")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          <span aria-hidden="true">✉</span> Subscribe
        </button>

        <section className="disclaimer-section">
          <h2>Disclaimer</h2>

          <p>{DISCLAIMER_TEXT}</p>
        </section>
      </main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} FundLens. US Equity Journal</span>

        <nav className="footer-links" aria-label="Legal information">
          <a href="#/privacy-policy">Privacy Policy</a>

          <a href="#/disclaimer">Disclaimer</a>
        </nav>
      </footer>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(() => {
    const route = window.location.hash.replace(/^#\/?/, "");

    return ["privacy-policy", "disclaimer"].includes(route) ? route : "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const route = window.location.hash.replace(/^#\/?/, "");

      setPage(
        ["privacy-policy", "disclaimer"].includes(route) ? route : "home",
      );

      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  if (page !== "home") {
    return <LegalPages page={page} />;
  }

  return <PortfolioHome />;
}
