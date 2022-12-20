# prpc-python - Pyodide Remote Procedure Calls - Typescript Client

[![npm version](https://badge.fury.io/js/@sfdl%2Fprpc.svg)](https://badge.fury.io/js/@sfdl%2Fprpc)
[![npm - License](https://img.shields.io/npm/l/@sfdl%2Fprpc.svg)](https://www.npmjs.com/package/@sfdl%2Fprpc)
[![GitHub issues](https://img.shields.io/github/issues/SocialFinanceDigitalLabs/prpc.svg)](https://github.com/SocialFinanceDigitalLabs/prpc/issues)

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
import { createApi, APITransport } from '@sfdl/prpc';
```

2. initialize the API and wait for it to confirm that it is ready

```javascript
const apiConfig = {
  transport: APITransport.WEB,
  options: {
    url: 'http://localhost:8000',
  },
};
const api = await createApi(apiConfig, () => {});
```

3. make a call to the API

```javascript
const apiResponse = await api.call("methodname", {/*payload*/})
```

For running in pyodide, set the apiConfig as follows:

```javascript

const apiConfig = {
  transport: APITransport.PYODIDE,
  options: {
    nativePackages: ['numpy', 'pandas'],
    packages: ['<your package name>'],
  },
};
```

`<your package name>` can either be the PyPI package name, or
the URL to a wheel file.
