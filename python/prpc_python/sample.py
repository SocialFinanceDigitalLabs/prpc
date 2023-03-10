import os
import io
import hashlib
from typing import Iterable
from PIL import Image, ImageDraw

from prpc_python import RpcApp

app = RpcApp("Sample App")

@app.call
def download_file():
    open('/sample.txt', 'x')
    f = open('/sample.txt', 'a')
    f.write('hello, world')
    f.close()

    with open('/sample.txt', 'rt') as fh:
        txt = fh.read()
    txt

    return txt


@app.call
def download_img():
    img = Image.new('RGBA', (100, 100), (255, 0, 0, 1))

    draw = ImageDraw.Draw(img)
    draw.ellipse((25, 25, 75, 75), fill=(255, 0, 0))

    img.save('/test.png', 'PNG')

    f = open("/test.png", 'rb')
    file_content = f.read()
    f.close()
    return file_content

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


@app.call
def checksum(algorithm: str = "sha256", single_file=None, multi_file=None):
    files = []
    if single_file:
        files.append(single_file)
    if multi_file:
        files.extend(multi_file)

    if not files:
        return "No files provided"

    print("Received the following files:")
    for f in files:
        print(f"  {f}")

    if algorithm not in hashlib.algorithms_available:
        return f"Algorithm {algorithm} not available"

    return_value = {}
    for file in files:
        hasher = hashlib.new(algorithm)
        hasher.update(file.read())
        return_value[file.filename] = hasher.hexdigest()
    return return_value
