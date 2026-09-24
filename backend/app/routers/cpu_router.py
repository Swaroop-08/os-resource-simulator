from fastapi import APIRouter, HTTPException
from typing import List
from app.models.process import CPUScheduleRequest, CPUScheduleResponse, ProcessInput
from app.algorithms.cpu_scheduling import run_cpu_scheduling
from app.utils.ml_recommender import predict_best_algorithm

router = APIRouter(prefix="/api/cpu", tags=["CPU Scheduling"])

@router.post("/simulate", response_model=CPUScheduleResponse)
def simulate_cpu(req: CPUScheduleRequest):
    try:
        return run_cpu_scheduling(
            algorithm=req.algorithm,
            processes=req.processes,
            time_quantum=req.time_quantum or 2
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/recommend")
def recommend_algorithm(processes: List[ProcessInput]):
    try:
        recommended_algo, reason = predict_best_algorithm(processes)
        return {
            "recommended_algorithm": recommended_algo,
            "reasoning": reason
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))