from typing import List
from app.models.disk import DiskScheduleRequest, DiskScheduleResponse, HeadMovement

def run_disk_scheduling(req: DiskScheduleRequest) -> DiskScheduleResponse:
    alg = req.algorithm.upper()
    if alg == "FCFS":
        seq = _fcfs_disk(req.head, req.requests)
    elif alg == "SSTF":
        seq = _sstf_disk(req.head, req.requests)
    elif alg == "SCAN":
        seq = _scan_disk(req.head, req.requests, req.disk_size, req.direction)
    elif alg == "C-SCAN":
        seq = _cscan_disk(req.head, req.requests, req.disk_size, req.direction)
    else:
        raise ValueError(f"Unsupported disk algorithm: {req.algorithm}")

    movements = []
    total_seek = 0
    for i in range(len(seq) - 1):
        dist = abs(seq[i+1] - seq[i])
        total_seek += dist
        movements.append(HeadMovement(from_track=seq[i], to_track=seq[i+1], distance=dist))

    return DiskScheduleResponse(
        sequence=seq,
        total_seek_time=total_seek,
        movements=movements
    )


def _fcfs_disk(head: int, requests: List[int]) -> List[int]:
    return [head] + requests


def _sstf_disk(head: int, requests: List[int]) -> List[int]:
    reqs = list(requests)
    curr = head
    seq = [head]

    while reqs:
        nearest = min(reqs, key=lambda x: abs(x - curr))
        seq.append(nearest)
        curr = nearest
        reqs.remove(nearest)

    return seq


def _scan_disk(head: int, requests: List[int], disk_size: int, direction: str) -> List[int]:
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])
    seq = [head]

    if direction.lower() == "left":
        seq.extend(reversed(left))
        if left:
            seq.append(0)
        seq.extend(right)
    else:
        seq.extend(right)
        if right:
            seq.append(disk_size - 1)
        seq.extend(reversed(left))

    return seq


def _cscan_disk(head: int, requests: List[int], disk_size: int, direction: str) -> List[int]:
    left = sorted([r for r in requests if r < head])
    right = sorted([r for r in requests if r >= head])
    seq = [head]

    if direction.lower() == "left":
        seq.extend(reversed(left))
        seq.append(0)
        seq.append(disk_size - 1)
        seq.extend(reversed(right))
    else:
        seq.extend(right)
        seq.append(disk_size - 1)
        seq.append(0)
        seq.extend(left)

    return seq