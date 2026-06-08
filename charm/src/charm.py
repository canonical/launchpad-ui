#!/usr/bin/env python3
"""Go Charm entrypoint."""

import logging
import typing

import ops
import paas_charm.go
from paas_charm.app import App

logger = logging.getLogger(__name__)


class LaunchpadUiCharm(paas_charm.go.Charm):
    """Go Charm service."""

    def __init__(self, *args: typing.Any) -> None:
        """Initialize the instance.

        Args:
            args: passthrough to CharmBase.
        """
        super().__init__(*args)

    def _create_app(self) -> App:
        """Build the App, stripping only the ``APP_`` prefix.

        Returns:
            A new App instance.
        """
        return App(
            container=self._container,
            charm_state=self._create_charm_state(),
            workload_config=self._workload_config,
            database_migration=self._database_migration,
            framework_config_prefix="",
            configuration_prefix="",
        )


if __name__ == "__main__":
    ops.main(LaunchpadUiCharm)
