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

const initializePyodide = async (id: string, config: APIConfig) => {
  self.postMessage({ id, body: LoadStatus.LOADING});
  pyodideInst = await self.loadPyodide();

  self.postMessage({ id, body: LoadStatus.LOADED});
  const options = config.options || {};
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

  self.postMessage({ id, body: LoadStatus.READY });
};

const runPyodideCode = async (id: string, payload: APIPayload) => {
  const { method, value } = payload;

  const serializer = new AttachedFileSerializer();
  const payloadJSON = JSON.stringify(value, serializer.serializer);

  try {
    const response = await apiApp.rpc(method, payloadJSON, serializer.files);
    self.postMessage({ id, body: JSON.parse(response) });
  } catch (ex) {
    self.postMessage({ id, error: ex });
  }
};

onmessage = async (evt: MessageEvent<PyodideWorkerDTO>) => {
  if (evt.data.action === PyodideWorkerAction.INIT) {
    await initializePyodide(evt.data.id, evt.data.body);
  } else if (evt.data.action === PyodideWorkerAction.RUN) {
    await runPyodideCode(evt.data.id, evt.data.body);
  }
};

export {};
