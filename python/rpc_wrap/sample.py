import os
from typing import Iterable

from rpc_wrap import RpcApp

app = RpcApp("Sample App")


@app.call(name='sum')
def sum_two(a: int, b: int) -> int:
    return a + b


@app.call
def sumlist(*args: int) -> int:
    return sum(args)


@app.call
def listfiles(path: str = ".") -> Iterable[str]:
    filesystem = {}
    for root, dirs, files in os.walk(path):
        path_elements = root.split(os.sep)
        current = filesystem
        for element in path_elements:
            current = current.setdefault(element, {})

        for d in dirs:
            current[d] = {}
        for f in files:
            current[f] = dict(size=os.path.getsize(os.path.join(root, f)))

    return filesystem

