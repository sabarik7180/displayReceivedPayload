const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let receivedData = []; // Store received data

// Serve HTML file directly
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Data Viewer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 50px;
                }
                #data-container {
                    margin-top: 20px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    display: inline-block;
                    min-width: 300px;
                }
            </style>
        </head>
        <body>

            <h1>API Data Viewer</h1>
            <button onclick="fetchData()">Fetch Data</button>
            <button onclick="sendData()">Send Data</button>
            
            <div id="data-container">
                <h3>Received Data:</h3>
                <pre id="data-output">No data yet</pre>
            </div>

            <script>
                async function fetchData() {
                    try {
                        let response = await fetch("/api/data");
                        let data = await response.json();
                        document.getElementById("data-output").textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }

                async function sendData() {
                    try {
                        let sampleData = { message: "Hello from frontend!", timestamp: new Date().toISOString() };
                        let response = await fetch("/api/data", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(sampleData)
                        });
                        let result = await response.json();
                        console.log(result);
                        fetchData(); // Refresh data after sending
                    } catch (error) {
                        console.error("Error sending data:", error);
                    }
                }
            </script>

        </body>
        </html>
    `);
});

// POST API to store received data
app.post("/api/data", (req, res) => {
    receivedData.push(req.body);
    console.log(req.body)
    res.json({ message: "Data received", receivedData });

    // Automatically delete the data after 10 seconds
    setTimeout(() => {
        receivedData = []; // Clear all stored data
        console.log("Data cleared after 10 seconds");
    }, 10000); // 10 seconds
});

// GET API to send stored data to frontend
app.get("/api/data", (req, res) => {
    res.json(receivedData);
});

const PORT = 5000;
app.listen(PORT, ()  => console.log(`Server running on http://localhost:${PORT}`));
