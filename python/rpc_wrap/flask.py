import json

from rpc_wrap import RpcApp
from flask import Flask, request, jsonify, abort
from flask_cors import CORS

flaskapp = Flask(__name__)
CORS(flaskapp)


def _get_app():
    app_header = request.headers.get('RPC-App')

    if app_header:
        return RpcApp.find(app_header)
    else:
        return RpcApp.first()


@flaskapp.route('/<command>', methods=['POST'])
def rpc(command):
    try:
        app = _get_app()
    except (RuntimeError, ImportError) as e:
        abort(404, "RPC Application not found")

    if request.data:
        data = json.loads(request.data)
    else:
        data = None
    result = app.run(command, data)

    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
