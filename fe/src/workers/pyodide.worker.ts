/* eslint-disable no-restricted-globals */
// need this because workers need access to the self pseudo-global scope

import { PyodideInterface } from 'pyodide';
import { PyodideWorkerAction } from '../enums/WorkerActions';
import { LoadStatus } from '../enums/LoadStatus';

//importScripts is a global. Only run it if it is available (ignore if the module is loaded onto window)
// @ts-ignore: importScripts on global causes choke in def file
if (typeof importScripts === 'function') {
  // @ts-ignore: importScripts on global causes choke in def file
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.2/full/pyodide.js');
}

let pyodideInst: PyodideInterface;

const initializePyodide = async () => {
  pyodideInst = await self.loadPyodide();
  self.postMessage(LoadStatus.READY);
};

const runPyodideCode = async (payload: any, config: any) => {
  await pyodideInst.loadPackage(config.wheelPath);
  await pyodideInst.runPythonAsync(`from main import ${config.endPoint}`);

  const val = await pyodideInst.runPythonAsync(
    `${config.endPoint}(${JSON.stringify(payload)})`
  );

  self.postMessage(val.get('val'));
};

onmessage = async (evt: any) => {
  if (evt.data.action === PyodideWorkerAction.INIT) {
    initializePyodide();
  }

  if (evt.data.action === PyodideWorkerAction.RUN) {
    const { payload, config } = evt.data.body;
    runPyodideCode(payload, config);
  }
};

export {};
