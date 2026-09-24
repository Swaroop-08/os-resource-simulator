from fastapi import APIRouter, HTTPException
from app.models.deadlock import DeadlockRequest, DeadlockResponse
from app.algorithms.deadlock import check_bankers_safety

router = APIRouter(prefix="/api/deadlock", tags=["Deadlock Management"])

@router.post("/check", response_model=DeadlockResponse)
def check_deadlock(req: DeadlockRequest):
    try:
        return check_bankers_safety(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))