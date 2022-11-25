/* eslint-disable no-restricted-globals */
// need this because workers need access to the self pseudo-global scope

import { PyodideInterface } from 'pyodide';
import { PyodideWorkerAction } from '../enums/WorkerActions';
import { LoadStatus } from '../enums/LoadStatus';
import { APIConfig, APIPayload } from '../api';
import { AttachedFileSerializer } from '../util/dataTransfer';
import { PyodideWorkerDTO } from '../api/pyodide';

//importScripts is a global. Only run it if it is available (ignore if the module is loaded onto window)
// @ts-ignore: importScripts on global causes choke in def file
if (typeof importScripts === 'function') {
  // @ts-ignore: importScripts on global causes choke in def file
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js');
}

let pyodideInst: PyodideInterface;
let apiApp: any;

const ensure_array = (value: any): Array<any> => {
  if (!value.map) {
    value = [value];
  }
  return value;
};

const initializePyodide = async (id: string, config: APIConfig) => {
  self.postMessage({ id, body: LoadStatus.LOADING });
  pyodideInst = await self.loadPyodide();

  self.postMessage({ id, body: LoadStatus.LOADED });
  const options = config.options || {};

  // Install native packages
  if (options.nativePackages) {
    const installs = ensure_array(options.nativePackages).map((pgk: string) => {
      console.log('loading native package', pgk);
      return pyodideInst.loadPackage(pgk);
    });
    await Promise.all(installs);
  }

  // Install micropip packages
  await pyodideInst.loadPackage('micropip');
  const micropip = pyodideInst.pyimport('micropip');
  if (options.packages) {
    const installs = ensure_array(options.packages).map((pgk: string) => {
      console.log('micropip installing', pgk);
      return micropip.install(pgk);
    });
    await Promise.all(installs);
  }

  // Launch RCP app
  apiApp = pyodideInst
    .pyimport(`rpc_wrap.pyodide`)
    .PyodideSession(options.appName);

  self.postMessage({ id, body: LoadStatus.READY });
};

const runPyodideCode = async (id: string, payload: APIPayload) => {
  const { method, value } = payload;

  const serializer = new AttachedFileSerializer();
  const payloadJSON = JSON.stringify(value, serializer.serializer);

  const response = await apiApp.rpc(method, payloadJSON, serializer.files);
  self.postMessage({ id, body: response ? JSON.parse(response) : undefined });
};

onmessage = async (evt: MessageEvent<PyodideWorkerDTO>) => {
  try {
    if (evt.data.action === PyodideWorkerAction.INIT) {
      await initializePyodide(evt.data.id, evt.data.body);
    } else if (evt.data.action === PyodideWorkerAction.RUN) {
      await runPyodideCode(evt.data.id, evt.data.body);
    }
  } catch (error) {
    console.error('Error occurred during pyodide action', error);
    self.postMessage({ id: evt.data.id, error });
  }
};

export {};
