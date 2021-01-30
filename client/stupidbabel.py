import os
import re
def rplc(c):
    rgx = r'Math\.pow\(BigInt\((\w+)\),BigInt\((\w+)\)\)'
    matches = re.finditer(rgx, c)

    finalstr = c

    for match in reversed(list(matches)):
        a1 = match.group(1)
        a2 = match.group(2)

        replacecode = a1 + " ** " + a2
        
        finalstr = finalstr[:match.start(0)] + replacecode + finalstr[match.end(0):]
        
    return finalstr


def main():
    d = os.listdir("build/static/js")
    print(d)
    for dd in d:
        ccc = ""
        with open("build/static/js/" + dd, "r") as f:
            cc = f.read()
            ccc = rplc(cc)
        with open("build/static/js/" + dd, "w") as f:
            f.write(ccc)
    

if __name__=="__main__":
    main()
