from werkzeug.datastructures import FileStorage
from ..__api import RemoteFile


class FlaskFile(RemoteFile):

    def __init__(self, file_storage: FileStorage):
        self.__file = file_storage

    def read(self, *args, **kwargs):
        return self.__file.stream.read(*args, **kwargs)

    @property
    def content_type(self):
        return self.__file.content_type

    @property
    def filename(self):
        return self.__file.filename

    @property
    def size(self):
        return self.__file.content_length

