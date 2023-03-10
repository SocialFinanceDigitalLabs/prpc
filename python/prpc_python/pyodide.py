import json
from io import BytesIO
from typing import Optional
from prpc_python import RpcApp
from prpc_python.__api import RemoteFile


class PyodideFile(RemoteFile):

    def __init__(self, js_file, data):
        self.js_file = js_file
        self.__data = data

    def read(self, *args, **kwargs):
        return BytesIO(self.__data).read(*args, **kwargs)

    @property
    def content_type(self):
        return self.js_file.type

    @property
    def filename(self):
        return self.js_file.name

    @property
    def size(self):
        return self.js_file.size


async def create_file_wrapper(file: "pyodide.JsProxy") -> PyodideFile:
    data = await file.arrayBuffer()
    data = data.to_py()
    return PyodideFile(file, data)


class PyodideSession:

    def __init__(self, app_name: str = None):
        if app_name:
            self.app = RpcApp.find(app_name)
        else:
            self.app = RpcApp.first()

    async def rpc(self, method: str, value: Optional[str], files=None):
        if files:
            files = files.to_py()
            files = {k: await create_file_wrapper(v) for k, v in files.items()}

        if isinstance(value, str):
            def decode(value):
                if value.get("__type__") == "file":
                    return files[value["cid"]]
                return value

            value = json.loads(value, object_hook=decode)

        result = self.app.run(method, value)
        if result is None:
            return None
        else:
            return json.dumps(result)
