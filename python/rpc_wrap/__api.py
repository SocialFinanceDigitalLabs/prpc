import os
from functools import partial, wraps

from pkg_resources import EntryPoint, iter_entry_points


def _resolve_entry_points():
    if env := os.getenv("RPC_APP"):
        for app_name in env.split(","):
            yield RpcApp.find(app_name.strip())

    for ep in iter_entry_points("rpc_app"):
        yield ep


class RpcApp:
    SAMPLE_APP = "sample=rpc_wrap.sample:app"

    def __init__(self, name="RpcApp"):
        self.__name = name
        self.__calls = {}

    @property
    def name(self):
        return self.__name

    def call(self, func=None, name=None):
        if func is None:
            return partial(self.call, name=name)

        @wraps(func)
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        self.__calls[name or func.__name__] = wrapper

        return wrapper

    def run(self, command, payload):
        if payload is None:
            return self.__calls[command]()
        elif isinstance(payload, dict):
            return self.__calls[command](**payload)
        elif isinstance(payload, list):
            return self.__calls[command](*payload)
        else:
            return self.__calls[command](payload)

    def __repr__(self):
        return f"<RpcApp {self.__name}>"

    @staticmethod
    def first() -> "RpcApp":
        try:
            return next(_resolve_entry_points())
        except StopIteration:
            raise RuntimeError("No RPC apps found")

    @staticmethod
    def find(name) -> "RpcApp":
        try:
            ep = EntryPoint.parse(name)
        except ValueError:
            ep = EntryPoint.parse(f"app={name}")
        return ep.resolve()

