import json

from werkzeug.datastructures import FileStorage

from prpc_python import RpcApp
from flask import Flask, request, jsonify
from flask_cors import CORS

from prpc_python.__api import RemoteFile

flaskapp = Flask(__name__)
CORS(flaskapp)


class FlaskFile(RemoteFile):

    def __init__(self, file_storage: FileStorage):
        self.__file = file_storage

    def read(self, *args, **kwargs):
        return self.__file.stream.read(*args, **kwargs)

    @property
    def content_type(self):
        return self.__file.content_type

    @property
    def filename(self):
        return self.__file.filename

    @property
    def size(self):
        return self.__file.content_length


@flaskapp.route('/', methods=['POST'])
def rpc():

    if request.form.get("RPC-App"):
        app = RpcApp.find(request.form['RPC-App'])
    else:
        app = RpcApp.first()

    def decode(value):
        if value.get("__type__") == "file":
            return FlaskFile(request.files[value["cid"]])
        return value

    if request.form.get("value"):
        data = json.loads(request.form['value'], object_hook=decode)
    else:
        data = None

    result = app.run(request.form['method'], data)

    response = jsonify(result)
    return response
