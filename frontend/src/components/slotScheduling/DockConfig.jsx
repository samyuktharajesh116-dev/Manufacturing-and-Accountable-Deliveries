import { useState } from "react";

export default function DockConfig({ config, onSave }) {
  const [form, setForm] = useState({ ...config });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
    setSaved(false);
  };

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="form-card">
      <h3 className="section-title">Dock Configuration</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Number of Docks</label>
          <input
            type="number"
            name="num_docks"
            value={form.num_docks}
            onChange={handleChange}
            min={1}
            max={20}
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Slot Duration (min)</label>
          <input
            type="number"
            name="slot_duration"
            value={form.slot_duration}
            onChange={handleChange}
            min={5}
            step={5}
            className="input"
          />
        </div>

        <div className="form-group">
          <label>Start Hour (0–23)</label>
          <input
            type="number"
            name="start_hour"
            value={form.start_hour}
            onChange={handleChange}
            min={0}
            max={23}
            className="input"
          />
        </div>

        <div className="form-group">
          <label>End Hour (0–23)</label>
          <input
            type="number"
            name="end_hour"
            value={form.end_hour}
            onChange={handleChange}
            min={1}
            max={24}
            className="input"
          />
        </div>
      </div>

      <button className="btn-secondary" onClick={handleSave}>
        {saved ? "✓ Saved" : "Save Configuration"}
      </button>
    </div>
  );
}