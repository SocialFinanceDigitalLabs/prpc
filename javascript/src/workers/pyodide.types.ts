export type PyodideWorkerDTO = {
  id: string;
  action: PyodideWorkerAction;
  body?: any;
  closes: boolean;
};

export type PyodideWorkerResponseDTO = {
  id: string;
  body?: any;
  error?: any;
  closes: boolean;
};

export enum PyodideWorkerAction {
  INIT = 'INIT',
  RUN = 'RUN',
}
