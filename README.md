# prpc - pyodide remote procedure calls

A very simple [RPC-like](rpc) library to make writing [Pyodide](pyodide) applications easier.

At the core of the library is a simple App + Decorator based approach inspired by 
[Flask](flask). In fact, Flask is one of the possible ways of interacting with your 
application.

The principle here is that when writing a javascript-based front-end talking to a "server" running
in Pyodide, you do not need to change your code at all to switch between a local pyodide 
and a web-based development mode.

In javascript, it is as simple as:

```javascript
const response = await api.callAPI({method: 'sum', value: {a: 1, b: 2}});
```

And you do not need to know anything about the underlying implementation.

On the Python side it is the same:

```python
from prpc_python import RpcApp
app = RpcApp("Sample App")


@app.call(name='sum')
def sum_two(a: int, b: int) -> int:
    return a + b
```

## Launching a Python application

To launch a python application, you need to install the `prpc-python` package:

```bash

pip install prpc-python['simple']

```

Then you can launch the sample application with:

```bash
prpc run -s sum '{"a": 1, "b": 2}' 
```

In this example -s means that we launch the sample app, `sum` is the command we're going to launch,
then follows the json encoded input.

You can also get a list of all commands your application exposes with:

```bash
prpc commands -s
```

You can launch the Flask server with:

```bash
prpc flask
```

and test it using curl:

```bash 
curl -X POST http://localhost:8000 -d 'RPC-App=prpc_python.sample:app&method=sum&value={"a": 1, "b": 2}'   
```
[flask]: https://flask.palletsprojects.com/
[pyodide]: https://pyodide.org/en/stable/
[rpc]: https://en.wikipedia.org/wiki/Remote_procedure_call
