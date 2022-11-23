import React, {useEffect, useState} from "react";
import {TransportPropsHandler} from "../../App";
import SumService from "../../sample/sumService";
import { sample } from "@sfdl/prpc";

function StaticTransportConfig(props: TransportPropsHandler) {
    const { disabled, onChange } = props;
    const [source, setSource] = useState("sumService");

    useEffect(() => {
        const jsModule = source === "echoService" ? sample.EchoService : SumService;
        onChange({ jsModule })
    }, [onChange, source])

    return (
    <>
        <h3>JS configuration</h3>
        <div>
            <label htmlFor="source">Javascript Source:</label>
            <select name="source" onChange={ev => setSource(ev.target.value)} disabled={disabled}>
                <option value="sumService">Sum Service</option>
                <option value="echoService">Echo Service</option>
            </select>
        </div>
    </>
    )
}


export default StaticTransportConfig;
