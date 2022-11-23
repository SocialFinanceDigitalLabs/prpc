import json

from rpc_wrap import RpcApp
from flask import Flask, request, jsonify, abort
from flask_cors import CORS

flaskapp = Flask(__name__)
CORS(flaskapp)


@flaskapp.route('/', methods=['POST'])
def rpc():
    print("RPC", request.data, request.form, dict(request.files.items()))

    if request.form.get("RPC-App"):
        app = RpcApp.find(request.form['RPC-App'])
    else:
        app = RpcApp.first()

    def decode(value):
        if value.get("__type__") == "file":
            return request.files[value["cid"]]
        return value

    if request.form.get("value"):
        data = json.loads(request.form['value'], object_hook=decode)
    else:
        data = None

    result = app.run(request.form['method'], data)

    response = jsonify(result)
    return response
