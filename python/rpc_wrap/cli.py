import errno
import json

import click
import logging
import click_log
from rich import print_json
from rpc_wrap import RpcApp

logger = logging.getLogger(__name__)
click_log.basic_config(logger)


@click.command()
@click.argument("command")
@click.option('--payload', "-p", type=json.loads, help="The command payload")
@click.option('--sample', "-s", is_flag=True, help="Install sample app")
@click.option('--app', "-a", type=str, help="Run app with given name")
@click_log.simple_verbosity_option(logger)
def main(command, payload, sample, app):
    if app and sample:
        click.secho("ERROR: Cannot specify both app and sample", err=True, fg="red")
        exit(errno.EINVAL)

    if sample:
        app = RpcApp.SAMPLE_APP

    if app:
        app = RpcApp.find(app)
    else:
        app = RpcApp.first()
    result = app.run(command, payload)
    print_json(json.dumps(result))


if __name__ == '__main__':
    main()
