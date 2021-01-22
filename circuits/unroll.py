#!/usr/bin/env python3
import sys
import re

# LIMITATIONS ON FOR LOOPS:
# 1. no nested loops
# 2. iteration variable must not appear in things inside 
# 3. variables that should be redefined in every iteratoin should include the iteration variable
# 4. only increment by 1
# 5. only <
# 6. starting variable must be a number
# 7. ending must be variable

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
    return "/".join(file.split("/")[:-1]) + "/circuit.circom"

def write(file, contents):
    with open(file, "w") as f:
        f.write(contents)

def main(file, state):
    contents = read(file)

    newcontents = replaceloops(contents, state)

    new_file = newfile(file)

    write(new_file, newcontents)


if __name__ == "__main__":
    file_name = sys.argv[1]
    state = {}
    for i in range(1, len(sys.argv)//2):
        state[sys.argv[2 * i ]] = int(sys.argv[2 * i + 1])

    main(file_name, state)