const timeLabels = Array(20).fill("");
const cpuDataPoints = Array(20).fill(0);
const memDataPoints = Array(20).fill(0);

// 2. CPU Chart Initialization
const ctxCpu = document.getElementById("cpuChart").getContext("2d");
const cpuChart = new Chart(ctxCpu, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "CPU Usage (%)",
        data: cpuDataPoints,
        borderColor: "#ff6b81",
        backgroundColor: "rgba(255, 107, 129, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Makes the line smooth/curvy
      },
    ],
  },
  options: { animation: false, scales: { y: { min: 0, max: 100 } } },
});

// 3. Memory Chart Initialization
const ctxMem = document.getElementById("memChart").getContext("2d");
const memChart = new Chart(ctxMem, {
  type: "line",
  data: {
    labels: timeLabels,
    datasets: [
      {
        label: "Free Memory (MB)",
        data: memDataPoints,
        borderColor: "#1e90ff",
        backgroundColor: "rgba(30, 144, 255, 0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: { animation: false, scales: { y: { beginAtZero: true } } },
});

// 4. WebSocket Connection
const ws = new WebSocket("ws://localhost:3000");
const statusDiv = document.getElementById("connectionStatus");

ws.onopen = () => {
  statusDiv.innerText = "🟢 Connected to Server";
  statusDiv.classList.add("connected");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const cpuVal = parseFloat(data.cpuUsage);
  const memVal = parseFloat(data.freeMem);

  cpuDataPoints.shift();
  cpuDataPoints.push(cpuVal);

  memDataPoints.shift();
  memDataPoints.push(memVal);

  cpuChart.update();
  memChart.update();
};

ws.onclose = () => {
  statusDiv.innerText = "🔴 Disconnected";
  statusDiv.classList.remove("connected");
};
