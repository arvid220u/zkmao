#!/usr/bin/env python3
import sys
import re

def read(file):
    with open(file, "r") as f:
        return f.read()

def replaceloops(contents, state):

    rgx = r'for\s*\(var\s*(\w+)\s*=\s*(\d+);\s*\w+\s*<\s*(\w+);\s*\w+\+\+\)\s*\{([^}]*)\}'
    # matches = re.findall(rgx, contents)
    matches = re.finditer(rgx, contents)

    finalstr = contents

    for match in reversed(list(matches)):
        var = match.group(1)
        initval = int(match.group(2))
        endvar = match.group(3)
        endval = state[endvar]
        code = match.group(4)

        replacecode = ""
        for i in range(initval, endval):
            replacecode += code.replace(var, str(i))
        
        finalstr = finalstr[:match.start(0)] + replacecode + finalstr[match.end(0):]
        
    return finalstr


def newfile(file):
    return file.split(".")[0] + "_unrolled.circom"

def write(file, contents):
    with open(file, "w") as f:
        f.write(contents)

def main(file):
    contents = read(file)

    state = {
        "numDigits": 10
    }

    newcontents = replaceloops(contents, state)

    new_file = newfile(file)

    write(new_file, newcontents)


if __name__ == "__main__":
    main(sys.argv[1])