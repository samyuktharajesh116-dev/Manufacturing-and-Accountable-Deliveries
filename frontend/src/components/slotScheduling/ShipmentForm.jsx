import { useState } from "react";

const PRIORITIES = ["High", "Medium", "Low"];
const TASK_TYPES = ["Loading", "Unloading"];

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export default function ShipmentForm({ onAdd }) {
  const [form, setForm] = useState({
    shipment_id: "",
    arrival_time: "08:00",
    duration: 30,
    priority: "Medium",
    task_type: "Loading",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    const { shipment_id, arrival_time, duration, priority, task_type } = form;
    if (!shipment_id.trim()) return setError("Shipment ID is required.");
    if (!arrival_time) return setError("Arrival time is required.");
    if (Number(duration) < 1) return setError("Duration must be at least 1 minute.");

    const payload = {
      shipment_id: shipment_id.trim(),
      arrival_time: timeToMinutes(arrival_time),
      duration: Number(duration),
      priority,
      task_type,
    };

    try {
      await onAdd(payload);
      setForm({
        shipment_id: "",
        arrival_time: "08:00",
        duration: 30,
        priority: "Medium",
        task_type: "Loading",
      });
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to add shipment.");
    }
  };

  return (
    <div className="form-card">
      <h3 className="section-title">Add Shipment</h3>

      <div className="form-grid">
        <div className="form-group">
          <label>Shipment ID</label>
          <input
            name="shipment_id"
            value={form.shipment_id}
            onChange={handleChange}
            placeholder="e.g. SHP-001"
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input">
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Task Type</label>
          <select name="task_type" value={form.task_type} onChange={handleChange} className="input">
            {TASK_TYPES.map((task) => (
              <option key={task}>{task}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Arrival Time</label>
          <input
            type="time"
            name="arrival_time"
            value={form.arrival_time}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            min={1}
            className="input"
          />
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <button className="btn-primary" onClick={handleSubmit}>
        + Add Shipment
      </button>
    </div>
  );
}