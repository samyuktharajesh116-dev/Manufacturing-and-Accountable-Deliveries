import { useState, useEffect } from "react";
import ShipmentForm from "./ShipmentForm";
import ShipmentTable from "./ShipmentTable";
import DockConfig from "./DockConfig";
import ScheduleGrid from "./ScheduleGrid";
import BufferPanel from "./BufferPanel";
import * as api from "./api";

const DEFAULT_CONFIG = {
  num_docks: 3,
  slot_duration: 30,
  start_hour: 8,
  end_hour: 20,
};

export default function SlotSchedulingPage() {
  const [shipments, setShipments] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("setup");

  // Hydrate state from backend on mount
  useEffect(() => {
    api.getShipments().then((r) => setShipments(r.data.shipments)).catch(() => {});
    api.getDockConfig().then((r) => setConfig(r.data)).catch(() => {});
    api.getSchedule().then((r) => setSchedule(r.data)).catch(() => {});
  }, []);

  const handleAddShipment = async (payload) => {
    await api.addShipment(payload);
    const r = await api.getShipments();
    setShipments(r.data.shipments);
  };

  const handleDeleteShipment = async (shipmentId) => {
    if (!window.confirm(`Delete shipment ${shipmentId}?`)) return;

    await api.deleteShipment(shipmentId);
    const r = await api.getShipments();
    setShipments(r.data.shipments);
    setSchedule(null);
    setActiveTab("setup");
    setError("");
  };

  const handleConfigSave = async (cfg) => {
    await api.configureDocks(cfg);
    setConfig(cfg);
  };

  const handleClear = async () => {
    await api.clearShipments();
    setShipments([]);
    setSchedule(null);
    setError("");
  };

  const handleRunScheduler = async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.runScheduler();
      setSchedule(r.data);
      setActiveTab("results");
    } catch (err) {
      setError(err?.response?.data?.detail || "Scheduler failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const metrics = schedule?.metrics;

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <span className="header-icon">🏭</span>
          <div>
            <h1 className="page-title">Smart Dock Scheduler</h1>
            <p className="page-subtitle">Industrial Warehouse Slot Optimization System</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-num">{shipments.length}</span>
            <span className="stat-label">Shipments</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">{config.num_docks}</span>
            <span className="stat-label">Docks</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">{config.slot_duration}m</span>
            <span className="stat-label">Slot</span>
          </div>
        </div>
      </header>

      {/* Metrics bar (shown after scheduling) */}
      {metrics && (
        <div className="metrics-bar">
          <div className="metric">
            <span className="metric-val">{metrics.dock_utilization}%</span>
            <span className="metric-label">Dock Utilization</span>
          </div>
          <div className="metric">
            <span className="metric-val">{metrics.avg_wait_time} min</span>
            <span className="metric-label">Avg Wait Time</span>
          </div>
          <div className="metric">
            <span className="metric-val">{metrics.buffer_usage}%</span>
            <span className="metric-label">Buffer Usage</span>
          </div>
          <div className="metric">
            <span className="metric-val">{metrics.total_assigned}</span>
            <span className="metric-label">Assigned</span>
          </div>
          <div className="metric">
            <span className="metric-val buffered-val">{metrics.total_buffered}</span>
            <span className="metric-label">Buffered</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "setup" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("setup")}
        >
          Setup
        </button>
        <button
          className={`tab-btn ${activeTab === "results" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("results")}
          disabled={!schedule}
        >
          Results {schedule && `(${metrics?.total_assigned} assigned)`}
        </button>
        <button
          className={`tab-btn ${activeTab === "buffer" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("buffer")}
          disabled={!schedule}
        >
          Buffer {schedule && metrics?.total_buffered > 0 && `(${metrics.total_buffered})`}
        </button>
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === "setup" && (
          <div className="setup-layout">
            <div className="setup-left">
              <ShipmentForm onAdd={handleAddShipment} />
              <DockConfig config={config} onSave={handleConfigSave} />
            </div>
            <div className="setup-right">
              <div className="form-card">
                <div className="table-header">
                  <h3 className="section-title">Shipment Queue ({shipments.length})</h3>
                  {shipments.length > 0 && (
                    <button className="btn-danger-sm" onClick={handleClear}>
                      Clear All
                    </button>
                  )}
                </div>
                <ShipmentTable shipments={shipments} onDelete={handleDeleteShipment} />
              </div>

              {error && <div className="alert-error">{error}</div>}

              <button
                className="btn-run"
                onClick={handleRunScheduler}
                disabled={loading || shipments.length === 0}
              >
                {loading ? "⏳ Running Scheduler..." : "▶ Run Scheduler"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "results" && schedule && (
          <div>
            <ScheduleGrid schedule={schedule} />
          </div>
        )}

        {activeTab === "buffer" && schedule && (
          <BufferPanel buffered={schedule.buffered} />
        )}
      </div>
    </div>
  );
}