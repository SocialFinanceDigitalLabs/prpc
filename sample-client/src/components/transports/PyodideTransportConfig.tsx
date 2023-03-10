import React, {useEffect, useState} from "react";
import {TransportPropsHandler} from "../../App";

function PyodideTransportConfig(props: TransportPropsHandler) {
    const { disabled, onChange } = props;
    const [packages, setPackages] = useState("/bin/rpc_wrap-0.1.0-py3-none-any.whl")
    const [appName, setAppName] = useState("rpc_wrap.sample:app")

    useEffect(() => {
        onChange({"packages": packages.split(","), appName})
    }, [onChange, packages, appName])

    return (
    <>
        <h3>Pyodide configuration</h3>
        <div>
            <label htmlFor="packages">Packages to install (separated by commas):</label>
            <input name="packages" onChange={ev => setPackages(ev.target.value)} value={packages} disabled={disabled}/>
        </div>
        <div>
            <label htmlFor="appName">Application to call:</label>
            <input name="appName" onChange={ev => setAppName(ev.target.value)} value={appName} disabled={disabled}/>
        </div>
    </>
    )
}


export default PyodideTransportConfig;
