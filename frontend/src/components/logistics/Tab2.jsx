import { useEffect, useState } from "react";

export default function Tab2() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("all"); // all | loading | unloading
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/shipments");
      const data = await res.json();
      setShipments(data);
    } catch (err) {
      console.log("Error:", err);
    }
    setLoading(false);
  };

  // 🔍 FILTER BY SEARCH + VIEW
  const filtered = shipments
    .filter((s) => {
      if (view === "loading") return s.type === "loading";
      if (view === "unloading") return s.type === "unloading";
      return true;
    })
    .filter((s) => s.id.toLowerCase().includes(search.toLowerCase()));

  const getColor = (status) => {
    switch (status) {
      case "Loading":
        return "#00f5ff";
      case "Scheduled":
        return "#ffcc00";
      case "Delayed":
        return "#ff4d4d";
      case "Delivered":
        return "#00ff88";
      case "Unloading":
        return "#ff9f1c";
      default:
        return "#fff";
    }
  };

  const alerts = [
    "Truck delayed due to traffic",
    "Dock conflict at Kochi",
    "Shipment status updated",
  ];

  const timeline = [
    "09:00 Shipment created",
    "09:30 Carrier assigned",
    "10:15 Loading started",
    "11:00 In transit",
  ];

  return (
    <div style={styles.container}>

      {/* TITLE */}
      <h2 style={styles.title}>🚚 Live Logistics Dashboard</h2>

      {/* SEARCH */}
      <input
        placeholder="Search Shipment ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* 🔥 BUTTONS (RESTORED) */}
      <div style={styles.buttonRow}>
        <button
          onClick={() => setView("all")}
          style={view === "all" ? styles.activeBtn : styles.btn}
        >
          All
        </button>

        <button
          onClick={() => setView("loading")}
          style={view === "loading" ? styles.activeBtn : styles.btn}
        >
          Loading
        </button>

        <button
          onClick={() => setView("unloading")}
          style={view === "unloading" ? styles.activeBtn : styles.btn}
        >
          Unloading
        </button>
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* TABLE */}
        <div style={styles.card}>
          <h3 style={styles.subTitle}>📦 Shipments</h3>

          {loading ? (
            <p style={{ color: "#00f5ff" }}>Loading data...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>ETA</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No shipments found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td style={{ color: getColor(s.status), fontWeight: "bold" }}>
                        {s.status}
                      </td>
                      <td>{s.type}</td>
                      <td>{s.location}</td>
                      <td>{s.eta}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* SIDE PANEL */}
        <div style={styles.side}>

          <div style={styles.cardSmall}>
            <h3 style={styles.subTitle}>🚨 Alerts</h3>
            <ul>
              {alerts.map((a, i) => (
                <li key={i}>⚠ {a}</li>
              ))}
            </ul>
          </div>

          <div style={styles.cardSmall}>
            <h3 style={styles.subTitle}>📍 Tracking</h3>
            <ul>
              {timeline.map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "10px",
    color: "#fff",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    color: "#00f5ff",
    marginBottom: "15px",
  },

  search: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #00f5ff",
    background: "#0b0f1a",
    color: "#fff",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  btn: {
    padding: "10px 15px",
    border: "1px solid #00f5ff",
    background: "transparent",
    color: "#00f5ff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  activeBtn: {
    padding: "10px 15px",
    border: "1px solid #00f5ff",
    background: "#00f5ff",
    color: "#000",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
  },

  card: {
    background: "#121a2b",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #1f2a44",
  },

  cardSmall: {
    background: "#121a2b",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #1f2a44",
    marginBottom: "15px",
  },

  side: {
    display: "flex",
    flexDirection: "column",
  },

  subTitle: {
    color: "#00f5ff",
    marginBottom: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    color: "#fff",
  },
};