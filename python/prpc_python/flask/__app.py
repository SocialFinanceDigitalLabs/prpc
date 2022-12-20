import json
from pathlib import Path

import werkzeug.exceptions

from prpc_python import RpcApp
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from .__api import FlaskFile

template_dir = Path(__file__).parent / "__templates"
flaskapp = Flask(__name__, template_folder=template_dir.as_posix())
CORS(flaskapp)


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


@flaskapp.route('/', methods=['GET'])
def index():
    app = RpcApp.first()
    return render_template('index.html', app=app)


@flaskapp.errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request(e):
    return e.description, 400


@flaskapp.errorhandler(Exception)
def handle_internal_server_error(e):
    return str(e), 500
