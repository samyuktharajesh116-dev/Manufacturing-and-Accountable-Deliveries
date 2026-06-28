from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so your React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database tracking metrics by Shipment ID
SHIPMENT_DATABASE = {
    "SH-001": {
        "driverName": "Rajesh Kumar",
        "scheduledTime": "10:00 AM",
        "actualArrival": "10:12 AM",
        "totalDelay": "12 mins",
        "pointsDeducted": "20 pts",
        "standardTripTime": "150 mins",
        "actualTripTime": "120 mins",
        "timeSaved": "30 mins saved",
        "hourlyBonusRate": "₹ 120 / hr",
        "bonusEarned": "₹ 3000",
        "highlightIndex": 3
    },
    "SH-002": {
        "driverName": "Anil Joseph",
        "scheduledTime": "11:30 AM",
        "actualArrival": "11:34 AM",
        "totalDelay": "4 mins",
        "pointsDeducted": "5 pts",
        "standardTripTime": "180 mins",
        "actualTripTime": "195 mins",
        "timeSaved": "0 mins (Delayed)",
        "hourlyBonusRate": "₹ 120 / hr",
        "bonusEarned": "₹ 0",
        "highlightIndex": 1
    },
    "SH-003": {
        "driverName": "Suresh Raina",
        "scheduledTime": "02:00 PM",
        "actualArrival": "02:00 PM",
        "totalDelay": "On Time",
        "pointsDeducted": "0 pts",
        "standardTripTime": "120 mins",
        "actualTripTime": "100 mins",
        "timeSaved": "20 mins saved",
        "hourlyBonusRate": "₹ 120 / hr",
        "bonusEarned": "₹ 2000",
        "highlightIndex": 0
    }
}

@app.get("/api/performance/{shipment_id}")
def get_performance_metrics(shipment_id: str):
    """
    Fetch logistics reliability and incentive metrics for a specific Shipment ID.
    """
    normalized_id = shipment_id.strip().upper()
    
    if normalized_id in SHIPMENT_DATABASE:
        return SHIPMENT_DATABASE[normalized_id]
    
    raise HTTPException(
        status_code=404, 
        detail=f"Shipment ID '{shipment_id}' not found in the tracking database."
    )