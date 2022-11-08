# FE Library for PRPC

PRPC is an npm library which simplifies the process of integrating a Pyodide-Python layer (and much more)

PRPC seeks to simplify the integration of Pyodide + alternative APIs in a way that acts as an abstraction layer for the front-end. To do this is standardizes on an RPC call between the application layers, with a payload which instructs the API implementation on how to handle the request and return a response.

When Pyodide is used as a back-end it also simplifies the process of running the implementation in a WebWorker to allow complex data wrangling to take place without causing the UI to halt.

### Installation

`yarn add @sfdl/prpc`
or
`npm install --save-dev @sfdl/prpc`

### Usage

1. import the required library and types

```javascript
import { APIControl, APITransport, APIConfig, LoadStatus } from '@sfdl/prpc';
```

2. initialize the API and wait for it to confirm that it is ready

```javascript
api = new APIControl();
await api.loadTransport('PYODIDE', () => {
  console.log('API Ready');
});
```

3. make a call to the API

```javascript
api.callAPI({
    {
    method: "MY_PYTHON_METHOD",
    value: "PAYLOAD OF DATA",
    },
    (response) => {
        console.log(response);
    },
    {
    wheelPath: "path/to/wheel/file",
    endPoint: "RPC name to call",
    }
})
```
