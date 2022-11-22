import React, {useState, ChangeEvent, useCallback} from "react";
import {APITransport} from "@sfdl/prpc";
import PyodideTransportConfig from "./components/transports/PyodideTransportConfig";
import RpcContainer from "./components/RpcContainer";
import WebTransportConfig from "./components/transports/WebTransportConfig";
import JavascriptTransportConfig from "./components/transports/StaticTransportConfig";


export interface TransportPropsHandler {
    onChange: (options: any) => void;
    disabled: boolean;
}

function App() {
    const [transport, setTransport] = useState(APITransport.PYODIDE);
    const [config, setConfig] = useState(undefined);
    const [isRunning, setRunning] = useState(false);

    const selectTransport = (event: ChangeEvent<HTMLSelectElement>) => {
        setRunning(false);
        setTransport(event.target.value as APITransport);
        setConfig(undefined);
    }

    const updateConfig = useCallback((cfg: any) => {
        setConfig(cfg)
    }, [setConfig])

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
            {transport === APITransport.PYODIDE &&
            <PyodideTransportConfig onChange={updateConfig} disabled={isRunning}/>
            }
            {transport === APITransport.WEB &&
            <WebTransportConfig onChange={updateConfig} disabled={isRunning}/>
            }
            {transport === APITransport.STATIC &&
            <JavascriptTransportConfig onChange={updateConfig} disabled={isRunning}/>
            }
            {config && <button onClick={() => {
                setRunning(true);
            }} disabled={isRunning}>Launch</button>}
            {isRunning && config && <RpcContainer transport={transport} options={config}/>}
        </>
    );
}

export default App;
