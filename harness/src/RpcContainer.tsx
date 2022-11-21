import React, { useState, useEffect } from "react";
import { APIControl, APITransport, LoadStatus } from "@sfdl/prpc";


interface RpcContainerProps {
  transport: APITransport;
  options: any;
}

type DataResponse = {
  data: LoadStatus | unknown;
};

function RpcContainer(props: RpcContainerProps) {
  const { transport, options } = props;
  const [loadStatus, setLoadStatus] = useState("Starting");
  const [method, setMethod] = useState("sum");
  const [data, setData] = useState(`{"a": 1, "b": 2}`);
  const [result, setResult] = useState("")
  const [api, setApi] = useState(null as APIControl | null)

  useEffect(() => {
    const init = async () => {
      const apiControl = new APIControl();
      await apiControl.loadTransport({transport, options}, handleAPIResponse);
      setApi(apiControl)
    };

    if (!api) {
      init();
    }
  }, [api, transport, options]);

  const handleClick = () => {
    api &&
      api.callAPI(
        {
          method,
          value: JSON.parse(data),
        },
        (response) => {
            console.log("RECEIVED API RESPONSE", response);
            setResult(JSON.stringify(response.data));
        }
      );
  };

  const handleAPIResponse = (response: DataResponse) => {
    console.log("RECEIVED API RESPONSE", response);
    setLoadStatus(response.data as string);
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
