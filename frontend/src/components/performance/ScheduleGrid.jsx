import React, { useState } from 'react';

export default function ScheduleGrid() {
  const [shipmentId, setShipmentId] = useState('SH-001');
  const [currentPhase, setCurrentPhase] = useState('Arrival');
  
  // Mock data dictionary using Shipment IDs as keys
  const shipmentData = {
    'SH-001': {
      driverName: 'Rajesh Kumar',
      scheduledTime: '10:00 AM',
      actualArrival: '10:12 AM',
      totalDelay: '12 mins',
      pointsDeducted: '20 pts',
      standardTripTime: '150 mins',
      actualTripTime: '120 mins',
      timeSaved: '30 mins saved',
      hourlyBonusRate: '₹ 120 / hr',
      bonusEarned: '₹ 3000',
      highlightIndex: 3 // Matches 11-20 mins
    },
    'SH-002': {
      driverName: 'Anil Joseph',
      scheduledTime: '11:30 AM',
      actualArrival: '11:34 AM',
      totalDelay: '4 mins',
      pointsDeducted: '5 pts',
      standardTripTime: '180 mins',
      actualTripTime: '195 mins',
      timeSaved: '0 mins (Delayed)',
      hourlyBonusRate: '₹ 120 / hr',
      bonusEarned: '₹ 0',
      highlightIndex: 1 // Matches 1-5 mins
    },
    'SH-003': {
      driverName: 'Suresh Raina',
      scheduledTime: '02:00 PM',
      actualArrival: '02:00 PM',
      totalDelay: 'On Time',
      pointsDeducted: '0 pts',
      standardTripTime: '120 mins',
      actualTripTime: '100 mins',
      timeSaved: '20 mins saved',
      hourlyBonusRate: '₹ 120 / hr',
      bonusEarned: '₹ 2000',
      highlightIndex: 0 // Matches On Time
    }
  };

  // State to hold the currently displayed shipment metrics
  const [metrics, setMetrics] = useState(shipmentData['SH-001']);

  const handleSearch = () => {
    const trimmedId = shipmentId.trim().toUpperCase();
    if (shipmentData[trimmedId]) {
      setMetrics(shipmentData[trimmedId]);
    } else {
      alert(`Shipment ID "${trimmedId}" not found! Try SH-001, SH-002, or SH-003.`);
    }
  };

  const deductionMatrix = [
    { range: 'On Time', deduction: '0 pts', remaining: '100' },
    { range: '1 - 5 mins', deduction: '5 pts', remaining: '95' },
    { range: '6 - 10 mins', deduction: '10 pts', remaining: '90' },
    { range: '11 - 20 mins', deduction: '20 pts', remaining: '80' },
    { range: '21 - 30 mins', deduction: '40 pts', remaining: '60' },
    { range: '31 - 60 mins', deduction: '60 pts', remaining: '40' },
  ];

  const styles = {
    container: { backgroundColor: '#111827', color: '#f3f4f6', padding: '24px', minHeight: '100vh', fontFamily: 'sans-serif' },
    searchBarContainer: { display: 'flex', gap: '12px', marginBottom: '20px' },
    searchInput: { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff', padding: '8px 16px', borderRadius: '6px', width: '250px' },
    searchBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
    phaseToggle: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    phaseLabel: { color: '#9ca3af', fontSize: '14px' },
    phaseBtn: (isActive) => ({
      backgroundColor: isActive ? '#3b82f6' : '#1f2937',
      border: `1px solid ${isActive ? '#3b82f6' : '#374151'}`,
      color: isActive ? 'white' : '#9ca3af',
      padding: '6px 14px', borderRadius: '4px', cursor: 'pointer'
    }),
    dashboardGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    card: { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '20px' },
    cardTitle: { marginTop: 0, letterSpacing: '0.05em', color: '#d1d5db' },
    divider: { border: 0, borderTop: '1px solid #374151', margin: '14px 0' },
    metricRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#9ca3af' },
    tableSubtitle: { margin: '24px 0 10px 0', color: '#9ca3af', fontSize: '12px', letterSpacing: '0.05em' },
    matrixTable: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
    th: { textAlign: 'left', color: '#6b7280', padding: '6px 8px', borderBottom: '1px solid #374151' },
    td: (isHighlighted) => ({
      padding: '6px 8px',
      color: isHighlighted ? '#3b82f6' : '#9ca3af',
      fontWeight: isHighlighted ? 'bold' : 'normal',
      backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
    }),
    bonusDisplay: { marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #374151', paddingTop: '20px' },
    bonusAmount: { fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }
  };

  return (
    <div style={styles.container}>
      {/* Search Header by Shipment ID */}
      <div style={styles.searchBarContainer}>
        <input 
          type="text" 
          value={shipmentId} 
          onChange={(e) => setShipmentId(e.target.value)} 
          placeholder="Enter Shipment ID (e.g. SH-001)..."
          style={styles.searchInput}
        />
        <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
      </div>

      {/* Phase Selector Toggle */}
      <div style={styles.phaseToggle}>
        <span style={styles.phaseLabel}>Current Phase:</span>
        <button 
          style={styles.phaseBtn(currentPhase === 'Arrival')}
          onClick={() => setCurrentPhase('Arrival')}
        >
          Arrival
        </button>
        <button 
          style={styles.phaseBtn(currentPhase === 'Return')}
          onClick={() => setCurrentPhase('Return')}
        >
          Return
        </button>
      </div>

      {/* Main Grid Layout */}
      <div style={styles.dashboardGrid}>
        
        {/* Left Section: Driver Reliability Score */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>DRIVER RELIABILITY SCORE</h4>
          <hr style={styles.divider} />
          <div style={styles.metricRow}><span>Driver Name:</span> <strong style={{color: '#fff'}}>{metrics.driverName}</strong></div>
          <div style={styles.metricRow}><span>Scheduled Time:</span> <span>{metrics.scheduledTime}</span></div>
          <div style={styles.metricRow}><span>Actual Arrival:</span> <span>{metrics.actualArrival}</span></div>
          <div style={{...styles.metricRow, color: metrics.totalDelay === 'On Time' ? '#10b981' : '#ef4444'}}><span>Total Delay:</span> <strong>{metrics.totalDelay}</strong></div>
          <div style={{...styles.metricRow, color: metrics.pointsDeducted === '0 pts' ? '#9ca3af' : '#ef4444'}}><span>Points Deducted:</span> <strong>{metrics.pointsDeducted}</strong></div>

          {/* Deduction Reference Matrix Table */}
          <h5 style={styles.tableSubtitle}>DEDUCTION REFERENCE MATRIX</h5>
          <table style={styles.matrixTable}>
            <thead>
              <tr>
                <th style={styles.th}>Delay Range</th>
                <th style={styles.th}>Deduct</th>
                <th style={styles.th}>Score</th>
              </tr>
            </thead>
            <tbody>
              {deductionMatrix.map((item, idx) => (
                <tr key={idx}>
                  <td style={styles.td(idx === metrics.highlightIndex)}>{item.range}</td>
                  <td style={styles.td(idx === metrics.highlightIndex)}>{item.deduction}</td>
                  <td style={styles.td(idx === metrics.highlightIndex)}>{item.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Section: Driver Transit Incentive */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>DRIVER TRANSIT INCENTIVE</h4>
          <hr style={styles.divider} />
          <div style={styles.metricRow}><span>Standard Trip Time:</span> <span>{metrics.standardTripTime}</span></div>
          <div style={styles.metricRow}><span>Actual Trip Time:</span> <span>{metrics.actualTripTime}</span></div>
          <div style={{...styles.metricRow, color: metrics.bonusEarned === '₹ 0' ? '#ef4444' : '#10b981'}}><span>Time Saved:</span> <strong>{metrics.timeSaved}</strong></div>
          <div style={styles.metricRow}><span>Hourly Bonus Rate:</span> <span>{metrics.hourlyBonusRate}</span></div>
          
          <div style={styles.bonusDisplay}>
            <span>BONUS EARNED:</span>
            <span style={styles.bonusAmount}>{metrics.bonusEarned}</span>
          </div>
        </div>

      </div>
    </div>
  );
}