import React, { useState, useEffect } from "react";
import { IAPI, APITransport, LoadStatus, createApi } from "@sfdl/prpc";

interface RpcContainerProps {
  transport: APITransport;
  options: any;
}

let initial = true;

function RpcContainer(props: RpcContainerProps) {
  const { transport, options } = props;
  const [loadStatus, setLoadStatus] = useState("Starting");
  const [method, setMethod] = useState("sum");
  const [data, setData] = useState(`{"a": 1, "b": 2}`);
  const [singleFile, setSingleFile] = useState(null as File | null);
  const [multiFile, setMultiFile] = useState(null as FileList | null);
  const [result, setResult] = useState("");
  const [api, setApi] = useState(null as IAPI | null);

  useEffect(() => {
    const apiConfig: any = {
      transport,
      options,
    };

    const init = async () => {
      const apiContent = await createApi(apiConfig, handleAPIResponse);

      setApi(apiContent);
    };

    if (initial) {
      console.log("init...");
      initial = false;
      init();
    }
  }, []);

  const handleDownloadImageClick = async () => {
    if (!api) {
      return false;
    }

    const response = await api.call("download_img", null);

    const file = new Blob([response], { type: "image/png" });

    const encodedURI = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    document.body.appendChild(link);

    link.download = `example.png`;
    link.href = encodedURI;
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClick = async () => {
    if (!api) {
      return false;
    }

    const response = await api.call("download_file", null);

    const file = new Blob([response], { type: "application/text" });

    const encodedURI = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    document.body.appendChild(link);

    link.download = `example.txt`;
    link.href = encodedURI;
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = async () => {
    if (!api) {
      return;
    }
    const value = JSON.parse(data);
    if (singleFile) {
      value["single_file"] = singleFile;
    }
    if (multiFile) {
      value["multi_file"] = multiFile;
    }
    try {
      const response = await api.call(method, value);
      setResult(JSON.stringify(response));
    } catch (ex) {
      setResult(`ERROR: ${ex}`);
    }
  };

  const handleAPIResponse = (response: any) => {
    setLoadStatus(response as string);
  };

  const ready = loadStatus === LoadStatus.READY;

  return (
    <div className="App">
      <h3>API Status</h3>
      <div>
        <label htmlFor="apiStatus">Status: </label>
        <input
          type="text"
          name="apiStatus"
          value={loadStatus}
          disabled={true}
        />
      </div>
      <h3>RPC Input</h3>
      <div>
        <label htmlFor="method">Method: </label>
        <input
          type="text"
          name="method"
          onChange={(ev) => setMethod(ev.target.value)}
          value={method}
        />
      </div>
      <div>
        <label htmlFor="data">Input Data: </label>
        <textarea
          name="data"
          rows={10}
          cols={80}
          onChange={(ev) => setData(ev.target.value)}
          value={data}
        />
      </div>
      <div>
        <label htmlFor="singleFile">Upload Single File: </label>
        <input
          type="file"
          name="singleFile"
          multiple={false}
          onChange={(e) =>
            setSingleFile(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>
      <div>
        <label htmlFor="multiFile">Upload Multiple Files: </label>
        <input
          type="file"
          name="multiFile"
          multiple={true}
          onChange={(e) => setMultiFile(e.target.files)}
        />
      </div>
      <div>
        <button onClick={handleClick} disabled={!ready}>
          Click to hit API
        </button>
        <button onClick={handleDownloadClick} disabled={!ready}>
          Click to download text
        </button>
        <button onClick={handleDownloadImageClick} disabled={!ready}>
          Click to download image
        </button>
      </div>
      <h3>RPC Result</h3>
      <div>
        <label htmlFor="result">Result: </label>
        <textarea
          name="result"
          rows={10}
          cols={80}
          value={result}
          disabled={true}
        />
      </div>
    </div>
  );
}

export default RpcContainer;
