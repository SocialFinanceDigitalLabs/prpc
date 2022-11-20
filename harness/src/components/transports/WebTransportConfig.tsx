import React, {useEffect, useState} from "react";
import {TransportPropsHandler} from "../../App";


function WebTransportConfig(props: TransportPropsHandler) {
    const { onChange } = props;
    const [url, setUrl] = useState("http://127.0.0.1:8000/")
    const [appName, setAppName] = useState("rpc_wrap.sample:app")

    useEffect(() => {
        onChange({url, appName})
    }, [url, appName])

    return (
    <>
        <h3>Pyodide configuration</h3>
        <div>
            <label htmlFor="url">Server Root Url:</label>
            <input name="url" onChange={ev => setUrl(ev.target.value)} value={url}/>
        </div>
        <div>
            <label htmlFor="appName">Application to call:</label>
            <input name="appName" onChange={ev => setAppName(ev.target.value)} value={appName}/>
        </div>
    </>
    )
}


export default WebTransportConfig;
