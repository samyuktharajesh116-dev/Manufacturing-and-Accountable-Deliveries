export default function BufferPanel({ buffered }) {
  if (!buffered || buffered.length === 0) {
    return (
      <div className="form-card buffer-card">
        <h3 className="section-title">⚡ Buffer Queue</h3>
        <p className="buffer-empty">All shipments successfully assigned — buffer is empty.</p>
      </div>
    );
  }

  const minutesToHHMM = (mins) => {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  return (
    <div className="form-card buffer-card buffer-active">
      <h3 className="section-title">⚡ Buffer Queue ({buffered.length})</h3>
      <p className="buffer-note">
        These shipments could not be assigned due to insufficient dock availability and are queued
        for manual review or rescheduling.
      </p>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Priority</th>
              <th>Task</th>
              <th>Arrival</th>
              <th>Duration</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {buffered.map((b) => (
              <tr key={b.shipment_id} className="buffer-row">
                <td className="mono">{b.shipment_id}</td>
                <td>
                  <span className={`badge badge-${b.priority.toLowerCase()}`}>{b.priority}</span>
                </td>
                <td>{b.task_type}</td>
                <td>{minutesToHHMM(b.arrival_time)}</td>
                <td>{b.duration} min</td>
                <td className="reason-cell">{b.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}