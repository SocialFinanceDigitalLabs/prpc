import React, { useState, useEffect } from "react";
import { APIControl, APITransport, APIConfig, LoadStatus } from "@sfdl/prpc";

interface AppProps {
  apiTransport: APITransport;
  apiConfig: APIConfig;
}

type DataResponse = {
  data: LoadStatus | unknown;
};

let api: null | APIControl = null;

function App(props: AppProps) {
  const { apiTransport, apiConfig } = props;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      api = new APIControl();
      await api.loadTransport(apiTransport, handleAPIResponse);
    };

    if (!api) {
      init();
    }
  }, [apiTransport]);

  const handleClick = () => {
    api &&
      api.callAPI(
        {
          method: "UPLOAD",
          value: "",
        },
        (response) => {
          console.log(response);
        },
        apiConfig
      );
  };

  const handleAPIResponse = (data: DataResponse) => {
    console.log(data);

    if (data.data === LoadStatus.READY) {
      setReady(true);
    }
  };

  return (
    <div className="App">
      App here!
      <p>{ready && <button onClick={handleClick}>Click to hit API</button>}</p>
    </div>
  );
}

export default App;
