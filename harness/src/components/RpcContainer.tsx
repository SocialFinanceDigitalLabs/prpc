import React, { useState, useEffect } from "react";
import { APIControl, APITransport, LoadStatus } from "@sfdl/prpc";


interface RpcContainerProps {
  transport: APITransport;
  options: any;
}

function RpcContainer(props: RpcContainerProps) {
  const { transport, options } = props;
  const [loadStatus, setLoadStatus] = useState("Starting");
  const [method, setMethod] = useState("sum");
  const [data, setData] = useState(`{"a": 1, "b": 2}`);
  const [singleFile, setSingleFile] = useState(null as File | null);
  const [multiFile, setMultiFile] = useState(null as FileList | null);
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
    return () => {
        if (api) {
            setApi(null);
        }
    }
  }, [api, transport, options]);

  const handleClick = async () => {
      if (!api) {
          return;
      }
      const value = JSON.parse(data);
      if (singleFile) {
          value['single_file'] = singleFile;
      }
      if (multiFile) {
          value['multi_file'] = multiFile;
      }
      try {
          const response = await api.callAPI({method, value});
          setResult(JSON.stringify(response));
      } catch (ex) {
          setResult(`ERROR: ${ex}`);
      }
  };

  const handleAPIResponse = (response: any) => {
    setLoadStatus(response as string);
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
              <label htmlFor="singleFile">Upload Single File: </label>
              <input type="file" name="singleFile" multiple={false}
                     onChange={e => setSingleFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <div>
              <label htmlFor="multiFile">Upload Multiple Files: </label>
              <input type="file" name="multiFile" multiple={true}
                     onChange={e => setMultiFile(e.target.files)} />
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
