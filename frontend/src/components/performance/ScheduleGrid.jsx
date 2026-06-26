const PRIORITY_CELL = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
};

export default function ScheduleGrid({ schedule }) {
  if (!schedule) return null;
  const { schedule_matrix, slot_labels, num_docks, assigned } = schedule;

  // Build a map from shipment_id → assigned record
  const assignedMap = {};
  (assigned || []).forEach((a) => (assignedMap[a.shipment_id] = a));

  // For rendering: we need to compute colspan spans
  // Build render rows: each dock row = list of {id, priority, span, empty}
  const renderRows = schedule_matrix.map((dockSlots) => {
    const cells = [];
    let i = 0;
    while (i < dockSlots.length) {
      const cell = dockSlots[i];
      if (!cell) {
        cells.push({ empty: true, span: 1 });
        i++;
      } else {
        // count consecutive cells with same shipment_id
        let span = 1;
        while (
          i + span < dockSlots.length &&
          dockSlots[i + span] &&
          dockSlots[i + span].shipment_id === cell.shipment_id
        ) {
          span++;
        }
        cells.push({ empty: false, shipment_id: cell.shipment_id, priority: cell.priority, span });
        i += span;
      }
    }
    return cells;
  });

  // Show every Nth label to avoid crowding
  const labelStep = Math.max(1, Math.floor(slot_labels.length / 12));

  return (
    <div className="grid-section">
      <h3 className="section-title">Dock Schedule Grid</h3>
      <div className="grid-scroll">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="dock-label-th">Dock</th>
              {slot_labels.map((label, i) => (
                <th key={i} className="slot-th">
                  {i % labelStep === 0 ? label : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRows.map((row, dockIdx) => (
              <tr key={dockIdx}>
                <td className="dock-label-td">D{dockIdx + 1}</td>
                {row.map((cell, ci) =>
                  cell.empty ? (
                    <td key={ci} className="slot-empty" />
                  ) : (
                    <td
                      key={ci}
                      colSpan={cell.span}
                      className="slot-filled"
                      style={{ background: PRIORITY_CELL[cell.priority] }}
                      title={`${cell.shipment_id} | ${cell.priority} | ${
                        assignedMap[cell.shipment_id]?.start_time_str
                      } – ${assignedMap[cell.shipment_id]?.end_time_str}`}
                    >
                      <span className="slot-id">{cell.shipment_id}</span>
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="legend">
        {Object.entries(PRIORITY_CELL).map(([p, color]) => (
          <span key={p} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {p}
          </span>
        ))}
        <span className="legend-item">
          <span className="legend-dot legend-empty" />
          Available
        </span>
      </div>

      {/* Assignment details */}
      {assigned && assigned.length > 0 && (
        <div className="assign-list">
          <h4>Assignment Details</h4>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Priority</th>
                  <th>Task</th>
                  <th>Dock</th>
                  <th>Arrival</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Wait</th>
                  <th>Slots</th>
                </tr>
              </thead>
              <tbody>
                {assigned.map((a) => (
                  <tr key={a.shipment_id}>
                    <td className="mono">{a.shipment_id}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: PRIORITY_CELL[a.priority] + "22", color: PRIORITY_CELL[a.priority], border: `1px solid ${PRIORITY_CELL[a.priority]}` }}
                      >
                        {a.priority}
                      </span>
                    </td>
                    <td>{a.task_type}</td>
                    <td>D{a.dock}</td>
                    <td>{a.arrival_time_str}</td>
                    <td>{a.start_time_str}</td>
                    <td>{a.end_time_str}</td>
                    <td>{a.wait_time} min</td>
                    <td>{a.slots_used}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}