# -*- coding: utf-8 -*-

from os import path
from collections import Mapping

import contoml

from flask.config import Config as BaseConfig


class MonitorConfig(BaseConfig):

    def from_dict(self, dict_object):
        if isinstance(dict_object, Mapping):
            for k, v in dict_object.items():
                self[k] = v

    def from_toml(self, filename):
        file_path = filename
        if not path.isabs(filename):
            file_path = path.join(self.root_path, file_path)

        return self.from_dict(contoml.load(file_path).primitive)
