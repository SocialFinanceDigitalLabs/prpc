/* eslint-disable no-restricted-globals */
// need this because workers need access to the self pseudo-global scope

import { PyodideInterface } from 'pyodide';
import { PyodideWorkerAction } from '../enums/WorkerActions';
import { LoadStatus } from '../enums/LoadStatus';
import { APIConfig, APIPayload } from "../api";

//importScripts is a global. Only run it if it is available (ignore if the module is loaded onto window)
// @ts-ignore: importScripts on global causes choke in def file
if (typeof importScripts === 'function') {
  // @ts-ignore: importScripts on global causes choke in def file
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js');
}

let pyodideInst: PyodideInterface;
let apiApp: any;

const initializePyodide = async (config: APIConfig) => {
  self.postMessage(LoadStatus.LOADING);
  pyodideInst = await self.loadPyodide();

  self.postMessage(LoadStatus.LOADED);
  const options = config.options || {};
  console.log('Loading options', options);
  await pyodideInst.loadPackage('micropip');
  const micropip = pyodideInst.pyimport('micropip');
  if (options.packages) {
    const installs = options.packages.map((pgk: string) =>
      micropip.install(pgk)
    );
    await Promise.all(installs);
  }

  apiApp = pyodideInst
    .pyimport(`rpc_wrap.pyodide`)
    .PyodideSession(options.appName);

  self.postMessage(LoadStatus.READY);
};

const runPyodideCode = async (payload: APIPayload) => {
  const payloadJSON = JSON.stringify(payload);
  const response = await apiApp.rpc(payloadJSON);
  self.postMessage(JSON.parse(response));
};

onmessage = async (evt: any) => {
  if (evt.data.action === PyodideWorkerAction.INIT) {
    initializePyodide(evt.data.body);
  }

  if (evt.data.action === PyodideWorkerAction.RUN) {
    const { payload } = evt.data.body;
    runPyodideCode(payload);
  }
};

export {};
