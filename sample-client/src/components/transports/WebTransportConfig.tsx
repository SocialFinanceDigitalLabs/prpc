import React, {useEffect, useState} from "react";
import {TransportPropsHandler} from "../../App";


function WebTransportConfig(props: TransportPropsHandler) {
    const { disabled, onChange } = props;
    const [url, setUrl] = useState("http://127.0.0.1:8000/")
    const [appName, setAppName] = useState("rpc_wrap.sample:app")

    useEffect(() => {
        onChange({url, appName})
    }, [onChange, url, appName])

    return (
    <>
        <h3>Web configuration</h3>
        <div>
            <label htmlFor="url">Server Root Url:</label>
            <input name="url" onChange={ev => setUrl(ev.target.value)} value={url} disabled={disabled}/>
        </div>
        <div>
            <label htmlFor="appName">Application to call:</label>
            <input name="appName" onChange={ev => setAppName(ev.target.value)} value={appName} disabled={disabled}/>
        </div>
    </>
    )
}


export default WebTransportConfig;
