const PRIORITY_COLOR = {
  High: "badge-high",
  Medium: "badge-medium",
  Low: "badge-low",
};

const minutesToHHMM = (mins) => {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export default function ShipmentTable({ shipments, onDelete }) {
  if (!shipments.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📦</span>
        <p>No shipments added yet. Use the form above to add your first shipment.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Priority</th>
            <th>Task</th>
            <th>Arrival</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.shipment_id}>
              <td className="mono">{s.shipment_id}</td>
              <td>
                <span className={`badge ${PRIORITY_COLOR[s.priority]}`}>{s.priority}</span>
              </td>
              <td>{s.task_type}</td>
              <td>{minutesToHHMM(s.arrival_time)}</td>
              <td>{s.duration} min</td>
              <td>
                <button className="btn-danger-sm" onClick={() => onDelete(s.shipment_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}