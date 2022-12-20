import errno
import json

import click
import logging
import click_log
from rich import print_json
from prpc_python import RpcApp

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


def _get_app(sample, app):
    if app and sample:
        click.secho("ERROR: Cannot specify both app and sample", err=True, fg="red")
        exit(errno.EINVAL)

    if sample:
        app = RpcApp.SAMPLE_APP

    if app:
        app = RpcApp.find(app)
    else:
        app = RpcApp.first()
    return app


@click.group()
def prpc():
    pass


@prpc.command()
@click.argument("command")
@click.argument("payload", type=str)
@click.option('--sample', "-s", is_flag=True, help="Install sample app")
@click.option('--app', "-a", type=str, help="Run app with given name")
@click_log.simple_verbosity_option(logger)
def run(command, payload, sample, app):
    app = _get_app(sample, app)
    result = app.run(command, json.loads(payload))
    print_json(json.dumps(result))


@prpc.command()
@click.option('--sample', "-s", is_flag=True, help="Install sample app")
@click.option('--app', "-a", type=str, help="Run app with given name")
@click_log.simple_verbosity_option(logger)
def commands(sample, app):
    app = _get_app(sample, app)

    click.echo(f"{app.name} commands:")
    for command in app.commands:
        click.echo(f" * {command}")


@prpc.command()
@click.option('--port', "-p", type=int, help="Which port to run on", default=8000)
@click_log.simple_verbosity_option(logger)
def flask(port):
    from .flask import flaskapp
    flaskapp.run(debug=True, port=port)


if __name__ == '__main__':
    prpc()
