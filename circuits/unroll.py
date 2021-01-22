#!/usr/bin/env python3
import sys

def read(file):
    with open(file, "r") as f:
        return f.read()

def replaceloops(contents):
    return contents + "\nhello"

def newfile(file):
    return file.split(".")[0] + "_unrolled.circom"

def write(file, contents):
    with open(file, "w") as f:
        f.write(contents)

def main(file):
    contents = read(file)

    newcontents = replaceloops(contents)

    new_file = newfile(file)

    write(new_file, newcontents)


if __name__ == "__main__":
    main(sys.argv[1])