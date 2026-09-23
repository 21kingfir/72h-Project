import { useState, useEffect } from "react";
import "./style.css";
//fix the receiving of json
const ip = "127.0.0.1";
const port = "0000";
const url = ip + ":" + port;

async function GetData(systemdata, setSystemData) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    setSystemData(data);
    const cstateResponse = await fetch(url + "/cstate");
    if (!cstateResponse.ok) {
      throw new Error(`HTTP ${cstateResponse.status}`);
    }
    const cstate = await cstateResponse.json();
  } catch (err) {
    setSystemData(
      "couldnt successfully fetch sysdata. Please retry later or restart the system",
    );
  }
}

function App() {
  const [systemdata, setSystemData] = useState("fetching data");
  useEffect(() => {
    GetData(systemdata, setSystemData);
    const interval = setInterval(() => {
      GetData(systemdata, setSystemData);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="app">
        <div className="forme">
          <div className="head">
            <h1>Robot monitoring app</h1>
          </div>
          <div className="body">
            <p>{systemdata}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
