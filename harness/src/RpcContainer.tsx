import React, { useState, useEffect } from "react";
import { APIControl, APITransport, APIConfig, LoadStatus } from "@sfdl/prpc";


interface RpcContainer {
  transport: APITransport;
  options: any;
}

type DataResponse = {
  data: LoadStatus | unknown;
};

let api: null | APIControl = null;

function RpcContainer(props: RpcContainer) {
  const { transport, options } = props;
  const [loadStatus, setLoadStatus] = useState("Starting");
  const [method, setMethod] = useState("sum");
  const [data, setData] = useState(`{"a": 1, "b": 2}`);
  const [result, setResult] = useState("")

  useEffect(() => {
    const init = async () => {
      api = new APIControl();
      await api.loadTransport({transport, options}, handleAPIResponse);
    };

    if (!api) {
      init();
    }
  }, [transport, options]);

  const handleClick = () => {
    api &&
      api.callAPI(
        {
          method,
          value: JSON.parse(data),
        },
        (response) => {
            console.log("RECEIVED API RESPONSE", response.data);
            setResult(JSON.stringify(response.data));
        }
      );
  };

  const handleAPIResponse = (data: DataResponse) => {
    console.log("RECEIVED API RESPONSE", data);
    setLoadStatus(data.data as string);

  };

  const ready = (loadStatus === LoadStatus.READY);

  return (
      <div className="App">
          <h3>API Status</h3>
          <div>
              <label htmlFor="apiStatus">Status: </label>
              <input type="text" name="apiStatus" value={loadStatus} disabled={true}/>
          </div>
          <h3>RPC Input</h3>
          <div>
              <label htmlFor="method">Method: </label>
              <input type="text" name="method" onChange={ev => setMethod(ev.target.value)} value={method}/>
          </div>
          <div>
              <label htmlFor="data">Input Data: </label>
              <textarea name="data" rows={10} cols={80} onChange={ev => setData(ev.target.value)} value={data}/>
          </div>
          <div>
              <button onClick={handleClick} disabled={!ready}>Click to hit API</button>
          </div>
          <h3>RPC Result</h3>
          <div>
              <label htmlFor="result">Result: </label>
              <textarea name="result" rows={10} cols={80} value={result} disabled={true}/>
          </div>
      </div>
  );
}

export default RpcContainer;
