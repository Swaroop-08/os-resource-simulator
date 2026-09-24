from typing import List, Dict, Any
from app.models.process import Process, CPUScheduleResponse, GanttBlock, ProcessResult

def run_cpu_scheduling(algorithm: str, processes: List[Process], time_quantum: int = 2) -> CPUScheduleResponse:
    alg = algorithm.upper()
    if alg == "FCFS":
        return _fcfs(processes)
    elif alg in ["SJF", "SRTF"]:
        return _sjf(processes, preemptive=(alg == "SRTF"))
    elif alg == "RR":
        return _round_robin(processes, time_quantum)
    elif alg == "PRIORITY":
        return _priority(processes)
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")


def _calculate_metrics(gantt: List[GanttBlock], processes: List[Process]) -> CPUScheduleResponse:
    process_map = {p.pid: p for p in processes}
    first_execution: Dict[str, int] = {}
    completion_time: Dict[str, int] = {}

    for block in gantt:
        if block.pid not in first_execution:
            first_execution[block.pid] = block.start_time
        completion_time[block.pid] = block.end_time

    results = []
    tot_wt, tot_tat, tot_rt = 0, 0, 0

    for p in processes:
        ct = completion_time.get(p.pid, 0)
        tat = ct - p.arrival_time
        wt = tat - p.burst_time
        rt = first_execution.get(p.pid, 0) - p.arrival_time

        tot_wt += wt
        tot_tat += tat
        tot_rt += rt

        results.append(
            ProcessResult(
                pid=p.pid,
                arrival_time=p.arrival_time,
                burst_time=p.burst_time,
                priority=p.priority or 0,
                completion_time=ct,
                turnaround_time=tat,
                waiting_time=wt,
                response_time=rt
            )
        )

    n = len(processes)
    return CPUScheduleResponse(
        gantt_chart=gantt,
        process_results=results,
        average_waiting_time=round(tot_wt / n, 2) if n > 0 else 0.0,
        average_turnaround_time=round(tot_tat / n, 2) if n > 0 else 0.0,
        average_response_time=round(tot_rt / n, 2) if n > 0 else 0.0
    )


def _fcfs(processes: List[Process]) -> CPUScheduleResponse:
    sorted_procs = sorted(processes, key=lambda x: (x.arrival_time, x.pid))
    gantt: List[GanttBlock] = []
    current_time = 0

    for p in sorted_procs:
        if current_time < p.arrival_time:
            current_time = p.arrival_time
        start = current_time
        end = start + p.burst_time
        gantt.append(GanttBlock(pid=p.pid, start_time=start, end_time=end))
        current_time = end

    return _calculate_metrics(gantt, processes)


def _sjf(processes: List[Process], preemptive: bool) -> CPUScheduleResponse:
    n = len(processes)
    remaining_bt = {p.pid: p.burst_time for p in processes}
    proc_map = {p.pid: p for p in processes}
    completed = 0
    current_time = 0
    gantt: List[GanttBlock] = []
    last_pid = None

    while completed < n:
        ready = [p for p in processes if p.arrival_time <= current_time and remaining_bt[p.pid] > 0]

        if not ready:
            current_time += 1
            continue

        if preemptive:
            ready.sort(key=lambda x: (remaining_bt[x.pid], x.arrival_time, x.pid))
            chosen = ready[0]
            
            if gantt and gantt[-1].pid == chosen.pid:
                gantt[-1].end_time += 1
            else:
                gantt.append(GanttBlock(pid=chosen.pid, start_time=current_time, end_time=current_time + 1))
            
            remaining_bt[chosen.pid] -= 1
            current_time += 1
            if remaining_bt[chosen.pid] == 0:
                completed += 1
        else:
            ready.sort(key=lambda x: (x.burst_time, x.arrival_time, x.pid))
            chosen = ready[0]
            start = current_time
            end = start + chosen.burst_time
            gantt.append(GanttBlock(pid=chosen.pid, start_time=start, end_time=end))
            current_time = end
            remaining_bt[chosen.pid] = 0
            completed += 1

    return _calculate_metrics(gantt, processes)


def _round_robin(processes: List[Process], quantum: int) -> CPUScheduleResponse:
    sorted_procs = sorted(processes, key=lambda x: (x.arrival_time, x.pid))
    remaining_bt = {p.pid: p.burst_time for p in processes}
    gantt: List[GanttBlock] = []
    
    current_time = 0
    ready_queue = []
    visited = set()

    def add_arrived_processes(time_val):
        for p in sorted_procs:
            if p.arrival_time <= time_val and p.pid not in visited:
                ready_queue.append(p.pid)
                visited.add(p.pid)

    add_arrived_processes(current_time)

    while ready_queue or any(remaining_bt[pid] > 0 for pid in remaining_bt):
        if not ready_queue:
            next_arr = min(p.arrival_time for p in processes if p.pid not in visited)
            current_time = next_arr
            add_arrived_processes(current_time)
            continue

        curr_pid = ready_queue.pop(0)
        exec_time = min(quantum, remaining_bt[curr_pid])
        
        start = current_time
        end = start + exec_time
        gantt.append(GanttBlock(pid=curr_pid, start_time=start, end_time=end))
        
        remaining_bt[curr_pid] -= exec_time
        current_time = end

        add_arrived_processes(current_time)

        if remaining_bt[curr_pid] > 0:
            ready_queue.append(curr_pid)

    return _calculate_metrics(gantt, processes)


def _priority(processes: List[Process]) -> CPUScheduleResponse:
    n = len(processes)
    remaining_bt = {p.pid: p.burst_time for p in processes}
    completed = 0
    current_time = 0
    gantt: List[GanttBlock] = []

    while completed < n:
        ready = [p for p in processes if p.arrival_time <= current_time and remaining_bt[p.pid] > 0]

        if not ready:
            current_time += 1
            continue

        ready.sort(key=lambda x: (x.priority if x.priority is not None else 0, x.arrival_time, x.pid))
        chosen = ready[0]
        
        start = current_time
        end = start + chosen.burst_time
        gantt.append(GanttBlock(pid=chosen.pid, start_time=start, end_time=end))
        current_time = end
        remaining_bt[chosen.pid] = 0
        completed += 1

    return _calculate_metrics(gantt, processes)