# -*- coding: utf-8 -*-

from os import path
from collections import Mapping

from contoml import load as toml_load
from flask.config import Config as BaseConfig


__all__ = (
    'MonitorConfig',
)


class MonitorConfig(BaseConfig):

    def from_dict(self, dict_object):
        if isinstance(dict_object, Mapping):
            for k, v in dict_object.items():
                self[k] = v

    def from_toml(self, filename):
        file_path = filename
        if not path.isabs(filename):
            file_path = path.join(self.root_path, file_path)

        return self.from_dict(toml_load(file_path).primitive)
