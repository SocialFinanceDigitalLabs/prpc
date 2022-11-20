import React, {useState, ChangeEvent} from "react";
import {APITransport, APIConfig, LoadStatus} from "@sfdl/prpc";
import PyodideTransportConfig from "./components/transports/PyodideTransportConfig";
import RpcContainer from "./RpcContainer";
import WebTransportConfig from "./components/transports/WebTransportConfig";


export interface TransportPropsHandler {
    onChange: (options: any) => void;
}

interface AppProps {
    apiTransport: APITransport;
    apiConfig: APIConfig;
}

type DataResponse = {
    data: LoadStatus | unknown;
};

function App() {
    const [transport, setTransport] = useState(APITransport.PYODIDE);
    const [config, setConfig] = useState(undefined);
    const [isRunning, setRunning] = useState(false);

    const selectTransport = (event: ChangeEvent<HTMLSelectElement>) => {
        setRunning(false);
        setTransport(event.target.value as APITransport);
        setConfig(undefined);
    }

    console.log(config, transport, isRunning)
    return (
        <>
            <div>
                <label htmlFor="transport">Choose a transport:</label>
                <select name="transport" onChange={selectTransport} value={transport}>
                    {Object.values(APITransport).map(v =>
                        <option key={v} value={v}>{v}</option>
                    )}
                </select>
            </div>
            {transport == APITransport.PYODIDE &&
            <PyodideTransportConfig onChange={cfg => setConfig(cfg)}/>
            }
            {transport == APITransport.WEB &&
            <WebTransportConfig onChange={cfg => setConfig(cfg)}/>
            }
            {config && <button onClick={() => {
                setRunning(true);
            }} disabled={isRunning}>Launch</button>}
            {isRunning && config && <RpcContainer transport={transport} options={config}/>}
        </>
    );
}

export default App;
