import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { APITransport } from "@sfdl/prpc";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App
      apiTransport={APITransport.PYODIDE}
      apiConfig={{
        wheelPath: "/bin/dist/main-0.0.0-py3-none-any.whl",
        endPoint: "endpoint",
      }}
    />
  </React.StrictMode>
);
