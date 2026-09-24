from typing import List
from app.models.deadlock import DeadlockRequest, DeadlockResponse

def check_bankers_safety(req: DeadlockRequest) -> DeadlockResponse:
    n = len(req.processes)
    m = len(req.resources)
    
    need = [
        [req.max_matrix[i][j] - req.allocation_matrix[i][j] for j in range(m)]
        for i in range(n)
    ]

    work = list(req.available)
    finish = [False] * n
    safe_sequence = []
    logs = []

    logs.append(f"Initialized Work = {work}")

    while len(safe_sequence) < n:
        found = False
        for i in range(n):
            if not finish[i]:
                can_allocate = all(need[i][j] <= work[j] for j in range(m))
                if can_allocate:
                    logs.append(f"Process {req.processes[i]} can be allocated. Need {need[i]} <= Work {work}")
                    for j in range(m):
                        work[j] += req.allocation_matrix[i][j]
                    finish[i] = True
                    safe_sequence.append(req.processes[i])
                    logs.append(f"Process {req.processes[i]} completed. New Work = {work}")
                    found = True
                    break
        
        if not found:
            logs.append("System is in an UNSAFE state. Deadlock potential detected.")
            return DeadlockResponse(
                is_safe=False,
                need_matrix=need,
                safe_sequence=[],
                execution_steps=logs
            )

    logs.append(f"Safe sequence found: {' -> '.join(safe_sequence)}")
    return DeadlockResponse(
        is_safe=True,
        need_matrix=need,
        safe_sequence=safe_sequence,
        execution_steps=logs
    )