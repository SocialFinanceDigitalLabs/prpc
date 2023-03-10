import errno
import json
import os
import sys
from functools import wraps

import click
import logging
import click_log
from rich import print_json
from prpc_python import RpcApp

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


def _find_app(name):
    try:
        return RpcApp.find(name)
    except ModuleNotFoundError:
        # Try to see if app is in the current working directory
        sys.path.append(os.getcwd())
        return RpcApp.find(name)


def _get_app(sample, app):
    if app and sample:
        click.secho("ERROR: Cannot specify both app and sample", err=True, fg="red")
        exit(errno.EINVAL)

    if sample:
        os.environ["PRPC_APP"] = app = RpcApp.SAMPLE_APP

    if app:
        app = _find_app(app)
    else:
        app = RpcApp.first()
    return app


def click_app_option(func):
    @click.option(
        "--app",
        "-a",
        help="The name of the app to run",
    )
    @click.option(
        "--sample",
        "-s",
        is_flag=True,
        help="Run the sample app",
    )
    @click.pass_context
    @wraps(func)
    def wrapper(ctx, app, sample, *args, **kwargs):
        app = _get_app(sample, app)
        return ctx.invoke(func, *args, app=app, **kwargs)

    return wrapper


@click.group()
def prpc():
    pass


@prpc.command()
@click.argument("command")
@click.argument("payload", type=str, required=False)
@click_app_option
@click_log.simple_verbosity_option(logger)
def run(command, payload, app):
    if payload:
        payload = json.loads(payload)
    result = app.run(command, payload)
    print_json(json.dumps(result))


@prpc.command()
@click_app_option
@click_log.simple_verbosity_option(logger)
def commands(app):
    click.echo(f"{app.name} commands:")
    for command in app.commands:
        click.echo(f" * {command}")


@prpc.command()
@click.option('--port', "-p", type=int, help="Which port to run on", default=8000)
@click_app_option
@click_log.simple_verbosity_option(logger)
def flask(port, app):
    from .flask import flaskapp
    flaskapp.run(debug=True, port=port)


if __name__ == '__main__':
    prpc()
