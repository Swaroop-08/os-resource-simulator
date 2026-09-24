from pydantic import BaseModel, Field
from typing import List

class DeadlockRequest(BaseModel):
    processes: List[str] = Field(..., description="List of Process IDs (e.g., ['P0', 'P1', 'P2'])")
    resources: List[str] = Field(..., description="List of Resource names (e.g., ['A', 'B', 'C'])")
    available: List[int] = Field(..., description="Available instances for each resource")
    max_matrix: List[List[int]] = Field(..., description="Max resource demand matrix [processes x resources]")
    allocation_matrix: List[List[int]] = Field(..., description="Currently allocated resource matrix [processes x resources]")

class DeadlockResponse(BaseModel):
    is_safe: bool = Field(..., description="True if system is in a safe state, False if deadlock/unsafe")
    need_matrix: List[List[int]] = Field(..., description="Calculated Need matrix (Max - Allocation)")
    safe_sequence: List[str] = Field(..., description="Safe execution sequence (empty if unsafe)")
    execution_steps: List[str] = Field(..., description="Step-by-step logs explaining the safety check execution")