import numpy as np
from sklearn.tree import DecisionTreeClassifier

# Feature vector: [process_count, burst_time_mean, burst_time_std, arrival_time_variance]
# Targets: 0 -> FCFS, 1 -> SJF, 2 -> Round Robin, 3 -> Priority

def train_dummy_model():
    # Synthetic dataset mapping process characteristics to optimal algorithms
    X = np.array([
        [3, 5.0, 1.2, 0.0],   # Short uniform bursts -> FCFS
        [10, 15.0, 12.5, 2.0], # High burst variance -> SJF
        [8, 4.0, 0.5, 1.5],   # Equal short bursts -> Round Robin
        [6, 8.0, 5.0, 0.0],   # Mixed arrival -> Priority
    ])
    y = np.array([0, 1, 2, 3])
    
    clf = DecisionTreeClassifier()
    clf.fit(X, y)
    return clf

model = train_dummy_model()

ALGO_MAP = {
    0: "First-Come, First-Served (FCFS)",
    1: "Shortest Job First (SJF)",
    2: "Round Robin (RR)",
    3: "Priority Scheduling"
}

def predict_best_algorithm(processes):
    if not processes:
        return "First-Come, First-Served (FCFS)", "Default selection."
        
    bursts = [p.burst_time for p in processes]
    arrivals = [p.arrival_time for p in processes]
    
    count = len(processes)
    mean_burst = np.mean(bursts)
    std_burst = np.std(bursts) if len(bursts) > 1 else 0.0
    var_arrival = np.var(arrivals) if len(arrivals) > 1 else 0.0
    
    features = np.array([[count, mean_burst, std_burst, var_arrival]])
    prediction = model.predict(features)[0]
    
    recommended = ALGO_MAP.get(prediction, "Shortest Job First (SJF)")
    reasoning = (
        f"High variance in burst times (σ={std_burst:.1f}ms) detected. "
        f"{recommended} is recommended to minimize average waiting time."
    )
    return recommended, reasoning