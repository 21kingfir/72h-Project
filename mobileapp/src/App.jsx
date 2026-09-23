import { useState, useEffect } from "react";
import "./style.css";

const systemid = "" //fill this part with your system name

async function getip(setip) {
  try {
    const response = fetch("http://" + systemid + ".local:6767/id");
    const datajson = (await response).json();
    if (datajson.id == systemid) {
      setip("http://" + systemid + ".local:6767")
    } else {
      setip('')
    }
  } catch (err) {
  }
}

async function GetData(setcstate, setmetrics, setvalues, ip) {
  if (ip == '') {
    const temparr = ["error"];
    const tempval = ["system ip hasn't been finded"];
    setmetrics(temparr);
    setvalues(tempval);
    return 0;
  }
  try {
    const response = await fetch(ip);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const cstateResponse = await fetch(ip + "/cstate");
    if (!cstateResponse.ok) {
      throw new Error(`HTTP ${cstateResponse.status}`);
    }
    const output = await cstateResponse.json();
    if (output.state == 1) {
      setcstate("connected");
    } else {
      setcstate("unconnected");
    }
    let i = 0;
    const tempkey = [];
    const tempvalue = [];
    for (const [key, value] of Object.entries(data)) {
      tempkey.push(key);
      tempvalue.push(value);
      i++;
    }
    tempkey.push("state")
    tempvalue.push(setcstate)
    setmetrics(tempkey);
    setvalues(tempvalue);
  } catch (err) {
    const temparr = ["error"];
    const tempval = ["couldn't fetch properly data"];
    setmetrics(temparr);
    setvalues(tempval);
  }
}

function App() {
  const [cstate, setcstate] = useState("system not found")
  const [metrics, setmetrics] = useState(["state"])
  const [values, setvalues] = useState(["fetching data"])
  const [ip, setip] = useState('')

  useEffect(() => {
    getip(setip);
    GetData(setcstate, setmetrics, setvalues, ip);
    const interval = setInterval(() => {
      getip(setip);
      GetData(setcstate, setmetrics, setvalues, ip);
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
            <ul>
              {metrics.map((metric, i) => (
                <li key={i}>
                  {metric} : {values[i]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
