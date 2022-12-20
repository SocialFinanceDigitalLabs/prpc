
# prpc-python - Pyodide Remote Procedure Calls - Python Server

[![PyPI version](https://badge.fury.io/py/prpc-python.svg)](https://badge.fury.io/py/prpc-python)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/prpc-python.svg)](https://pypi.org/project/prpc-python/)
[![PyPI - License](https://img.shields.io/pypi/l/prpc-python.svg)](https://pypi.org/project/prpc-python/)
[![GitHub issues](https://img.shields.io/github/issues/SocialFinanceDigitalLabs/prpc.svg)](https://github.com/SocialFinanceDigitalLabs/prpc/issues)

Provides server-side bindings for [prpc][prpc] API. 

To expose a python function as a prpc method you first create
a prpc `RpcApp` and then decorate your function with `@app.call`. 

Create a file called `myapp.py` and add the following code:

```python
# myapp.py
from prpc_python import RpcApp

app = RpcApp("Sample App")


@app.call
def hello() :
    return "World"
```

## Discovering your API

You can now discover your API using the `prpc` command line tool. To do this
you either have to specify the plugin ID of your app or "publish" the
plugin using the Python [plugin discovery][discovery] approach.

The ID of your plugin is the name of the module containing 
your `RpcApp` instance plus the name of the instance, e.g. 
`myapp:app` for the example above.

You can now use the command line tool to discover your API:

```bash
prpc commands -a myapp:app     
```

and you can even call your function from the command line:

```bash
prpc run -a myapp:app hello
```

## Publishing 

You don't always want to have to specify the plugin ID of your app. You can 
use the approach described in the [metadata][discovery] section of the packaging
spec to publish your plugin. If you have a `pyproject.toml` file, then add
the following section:

```toml
[tool.poetry.plugins."prpc_python"]
myapp = "myapp:app"
```

If your plugin is the only one in your installed dependencies, then it will
be automatically chosen, and you can omit the `-a myapp:app` argument.

## Files

prpc also supports file transfers. If you receive a file from the remote 
endpoint, you will receive a `prpc_python.RemoteFile` object. This object
has a standard `read` method, so you can use it as a file-like object.

It may also have `filename`, `size` and `content_type` attributes but it
depends on the source of the file whether these are available.

[prpc]: https://github.com/SocialFinanceDigitalLabs/prpc
[discovery]: https://packaging.python.org/en/latest/guides/creating-and-discovering-plugins/#using-package-metadata    
