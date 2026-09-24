from pydantic import BaseModel, Field
from typing import List, Optional

class Process(BaseModel):
    pid: str = Field(..., description="Process Identifier (e.g., P1, P2)")
    arrival_time: int = Field(..., ge=0, description="Arrival time in the ready queue")
    burst_time: int = Field(..., gt=0, description="Total CPU execution time required")
    priority: Optional[int] = Field(default=0, ge=0, description="Process priority (Lower number = Higher priority)")

class CPUScheduleRequest(BaseModel):
    algorithm: str = Field(..., description="FCFS, SJF, SRTF, RR, Priority")
    time_quantum: Optional[int] = Field(default=2, gt=0, description="Time quantum for Round Robin")
    processes: List[Process]

class GanttBlock(BaseModel):
    pid: str
    start_time: int
    end_time: int

class ProcessResult(BaseModel):
    pid: str
    arrival_time: int
    burst_time: int
    priority: int
    completion_time: int
    turnaround_time: int
    waiting_time: int
    response_time: int

class CPUScheduleResponse(BaseModel):
    gantt_chart: List[GanttBlock]
    process_results: List[ProcessResult]
    average_waiting_time: float
    average_turnaround_time: float
    average_response_time: float