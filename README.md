# 🖥️ OS Resource Management Simulator

An interactive, web-based Operating System Resource Management Simulator featuring an integrated Executive Dashboard, CPU/Disk Scheduling visualizers, Deadlock Management via Banker's Algorithm, and an **AI-driven Algorithm Advisor** powered by Machine Learning.

---

## 🌟 Key Features

### 1. 📊 Executive Dashboard
* **Unified Metrics:** Provides real-time status across active CPU workloads, deadlock safety states, and disk head metrics.
* **Process Lifecycle Visualizer:** Displays process states (`New`, `Ready`, `Running`, `Waiting`, `Terminated`).

### 2. ⚡ CPU Scheduling Engine & AI Advisor
* **Algorithms Implemented:**
  * First-Come, First-Served (FCFS)
  * Shortest Job First (SJF - Non-Preemptive)
  * Shortest Remaining Time First (SRTF)
  * Round Robin (RR) with custom time quantum
  * Priority Scheduling
* **AI Algorithm Advisor:** Integrated Decision Tree model (`scikit-learn`) that analyzes process load metrics (burst variance, arrival distribution) to recommend the optimal scheduling algorithm for minimal average waiting time.
* **Visualizations:** Interactive Gantt charts with detailed metrics ($WT$, $TAT$, $RT$).

### 3. 🛡️ Deadlock Avoidance (Banker's Algorithm)
* **Matrix Safety Checker:** Evaluates Allocation, Max, and Available resource matrices.
* **Safe Sequence Generator:** Automatically computes and displays safe execution sequences or flags unsafe deadlock states.

### 4. 💾 Disk & I/O Management
* **Algorithms Implemented:** FCFS, SSTF, SCAN, and C-SCAN.
* **Seek Time Analytics:** Displays disk-head traversal sequence and calculates total head movement/seek time.

---

## 🛠️ Tech Stack

### **Backend**
* **Framework:** FastAPI (Python)
* **Web Server:** Uvicorn
* **Data Validation:** Pydantic
* **Machine Learning:** Scikit-learn, NumPy

### **Frontend**
* **Framework:** React 18 + Vite
* **Styling:** Tailwind CSS
* **Icons & UI:** Lucide React, Recharts
* **HTTP Client:** Axios

---

## 📁 Repository Structure

```text
os-resource-simulator/
├── backend/
│   ├── app/
│   │   ├── algorithms/      # CPU, Deadlock & Disk algorithms
│   │   ├── models/          # Pydantic schemas & data models
│   │   ├── routers/         # API endpoints (/api/cpu, /api/deadlock, /api/disk)
│   │   ├── utils/           # ML recommender & utility logic
│   │   └── main.py          # FastAPI application entrypoint
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Cards)
│   │   ├── pages/           # Dashboard, CPU, Deadlock, and Disk pages
│   │   ├── services/        # Axios API integration layer
│   │   ├── App.jsx          # Root application component
│   │   └── main.jsx         # React DOM entrypoint
│   ├── package.json         # Node dependencies & scripts
│   └── vite.config.js       # Vite build & proxy config
└── README.md
