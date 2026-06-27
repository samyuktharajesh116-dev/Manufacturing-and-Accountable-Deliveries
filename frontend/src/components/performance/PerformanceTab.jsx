import React, { useState } from "react";

function PerformanceTab() {
  const [shipmentId, setShipmentId] = useState("");
  const [data, setData] = useState(null);
  const [phase, setPhase] = useState("Arrival");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: shipmentId })
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        alert("Shipment ID not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardCard}>
        <div style={styles.headerBanner}>
          <h2 style={styles.headerTitle}>Tab 3 - Performance & Incentive Calculation</h2>
          <p style={styles.headerSubtitle}>INSTANT DRIVER PERFORMANCE & ROWAN INCENTIVE</p>
        </div>

        <div style={styles.searchSection}>
          <label style={styles.label}>Select Shipment ID:</label>
          <div style={styles.searchRow}>
            <input 
              type="text" 
              placeholder="e.g., TEST01" 
              value={shipmentId} 
              onChange={(e) => setShipmentId(e.target.value)} 
              style={styles.input}
            />
            <button onClick={fetchData} style={styles.searchButton}>Search</button>
          </div>

          <div style={styles.phaseRow}>
            <span style={styles.phaseLabel}>Current Phase:</span>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={phase === "Arrival"} onChange={() => setPhase("Arrival")} /> Arrival
            </label>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" checked={phase === "Return"} onChange={() => setPhase("Return")} /> Return
            </label>
          </div>
        </div>

        {data && (
          <div style={styles.gridContainer}>
            <div style={styles.scoreCard}>
              <h3 style={styles.cardHeader}>DRIVER RELIABILITY SCORE</h3>
              <div style={styles.metricRow}><span>Driver Name:</span> <strong>{data.driver_name}</strong></div>
              <div style={styles.metricRow}><span>Scheduled Time:</span> <span>{data.scheduled_time}</span></div>
              <div style={styles.metricRow}><span>Actual Arrival:</span> <span>{data.actual_arrival}</span></div>
              <div style={styles.metricRow}><span style={{color: '#ffc107'}}>Total Delay:</span> <span style={{color: '#ffc107'}}>{data.total_delay}</span></div>
              <div style={styles.metricRow}><span style={{color: '#f44336'}}>Points Reduced:</span> <span style={{color: '#f44336'}}>{data.points_reduced}</span></div>
              
              <div style={styles.matrixContainer}>
                <div style={styles.matrixHeaderTitle}>DEDUCTION REFERENCE MATRIX</div>
                <div style={styles.matrixTableHeader}>
                  <span>Delay Range</span>
                  <span>Deduct</span>
                  <span>Score</span>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: data.score === 100 ? "#1f293d" : "transparent"}}>
                  <span>On Time</span><span style={{color: '#4caf50'}}>0 pts</span><strong>100</strong>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: (data.total_delay.includes("1 ") || data.total_delay.includes("2 ") || data.total_delay.includes("3 ") || data.total_delay.includes("4 ") || data.total_delay.includes("5 ")) && data.score === 95 ? "#1f293d" : "transparent"}}>
                  <span>1 - 5 mins</span><span style={{color: '#ff9800'}}>5 pts</span><strong>95</strong>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: (data.total_delay.includes("6 ") || data.total_delay.includes("7 ") || data.total_delay.includes("8 ") || data.total_delay.includes("9 ") || data.total_delay.includes("10 ")) && data.score === 90 ? "#1f293d" : "transparent"}}>
                  <span>6 - 10 mins</span><span style={{color: '#ff9800'}}>10 pts</span><strong>90</strong>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: data.score === 80 ? "#1f293d" : "transparent", borderLeft: data.score === 80 ? "3px solid #ffc107" : "none"}}>
                  <span style={{color: data.score === 80 ? '#ffc107' : '#8b949e'}}>11 - 20 mins</span><span style={{color: '#f44336'}}>20 pts</span><strong style={{color: data.score === 80 ? '#ffc107' : '#ffffff'}}>80</strong>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: data.score === 40 ? "#1f293d" : "transparent"}}>
                  <span>21 - 30 mins</span><span style={{color: '#f44336'}}>60 pts</span><strong>40</strong>
                </div>
                <div style={{...styles.matrixRow, backgroundColor: data.score === 20 ? "#1f293d" : "transparent"}}>
                  <span>31 - 60 mins</span><span style={{color: '#f44336'}}>80 pts</span><strong>20</strong>
                </div>
              </div>
            </div>

            <div style={styles.incentiveCard}>
              <div>
                <h3 style={styles.cardHeader}>DRIVER TRANSIT INCENTIVE</h3>
                <div style={styles.metricRow}><span>Standard Trip Time:</span> <span>{data.standard_trip_time}</span></div>
                <div style={styles.metricRow}><span>Actual Trip Time:</span> <span>{data.actual_trip_time}</span></div>
                <div style={styles.metricRow}><span style={{color: '#4caf50'}}>Time Saved:</span> <span style={{color: '#4caf50'}}>{data.time_saved}</span></div>
                <div style={styles.metricRow}><span>Hourly Bonus Rate:</span> <span>{data.hourly_bonus_rate}</span></div>
              </div>
              
              <div style={styles.bonusFooter}>
                <span style={{fontSize: '13px', fontWeight: '600', color: '#8b949e'}}>BONUS EARNED</span>
                <span style={styles.bonusAmount}>{data.bonus_earned}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: "#0d1117", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "'Segoe UI', Roboto, sans-serif", padding: "20px", color: "#ffffff" },
  dashboardCard: { width: "100%", maxWidth: "950px", backgroundColor: "#161b22", borderRadius: "12px", border: "1px solid #30363d", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden" },
  headerBanner: { backgroundColor: "#1f293d", padding: "18px", textAlign: "center", borderBottom: "2px solid #21262d" },
  headerTitle: { margin: 0, fontSize: "20px", fontWeight: "600", color: "#ffffff" },
  headerSubtitle: { margin: "5px 0 0 0", fontSize: "11px", color: "#8b949e", letterSpacing: "1px" },
  searchSection: { padding: "20px", backgroundColor: "#161b22", borderBottom: "1px solid #30363d" },
  label: { display: "block", marginBottom: "8px", fontSize: "13px", color: "#8b949e" },
  searchRow: { display: "flex", gap: "12px" },
  input: { flex: 1, backgroundColor: "#0d1117", border: "1px solid #30363d", borderRadius: "6px", padding: "10px", color: "#ffffff", fontSize: "14px" },
  searchButton: { backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", padding: "0 24px", fontWeight: "600", cursor: "pointer" },
  phaseRow: { display: "flex", gap: "15px", marginTop: "15px", alignItems: "center", fontSize: "13px" },
  phaseLabel: { color: "#8b949e", marginRight: "10px" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#c9d1d9" },
  gridContainer: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", padding: "20px", alignItems: "start" },
  scoreCard: { backgroundColor: "#1c2128", borderRadius: "8px", padding: "20px", border: "1px solid #30363d" },
  incentiveCard: { backgroundColor: "#1c2128", borderRadius: "8px", padding: "20px", border: "1px solid #30363d", minHeight: "340px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardHeader: { margin: "0 0 18px 0", fontSize: "13px", fontWeight: "600", color: "#8b949e", letterSpacing: "0.5px" },
  metricRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px", color: "#c9d1d9" },
  matrixContainer: { marginTop: "20px", padding: "12px", backgroundColor: "#0d1117", borderRadius: "8px", border: "1px solid #30363d" },
  matrixHeaderTitle: { fontWeight: "700", color: "#8b949e", marginBottom: "10px", fontSize: "11px", textAlign: "center", letterSpacing: "0.5px" },
  matrixTableHeader: { display: "flex", justifyContent: "space-between", color: "#8b949e", fontSize: "11px", fontWeight: "600", paddingBottom: "6px", borderBottom: "1px solid #30363d", marginBottom: "6px" },
  matrixRow: { display: "flex", justifyContent: "space-between", color: "#8b949e", padding: "6px 8px", fontSize: "13px", borderRadius: "4px", margin: "2px 0", alignItems: "center" },
  bonusFooter: { padding: "15px", backgroundColor: "#171b22", borderRadius: "6px", border: "1px solid #30363d", display: "flex", justifyContent: "space-between", alignItems: "center" },
  bonusAmount: { fontSize: "24px", fontWeight: "700", color: "#007bff" }
};

export default PerformanceTab;