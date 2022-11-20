import json
from dataclasses import dataclass
from typing import Any, Union

from rpc_wrap import RpcApp


@dataclass
class APIPayload:
    method: str
    value: Any


class PyodideSession:

    def __init__(self, app_name: str = None):
        if app_name:
            self.app = RpcApp.find(app_name)
        else:
            self.app =  RpcApp.first()

    def rpc(self, payload: Union[APIPayload, str]):
        if isinstance(payload, str):
            payload = APIPayload(**json.loads(payload))
        result = self.app.run(payload.method, payload.value)
        if result is None:
            return None
        else:
            return json.dumps(result)
