givenStrings = raw_input("Input the strings separated by ' ' and the character to check : ")
givenStrArray = givenStrings.split(" ")
charToCheck = givenStrArray.pop()
count = 0
for str1 in givenStrArray:
    if str1.count(charToCheck) > count:
        count = str1.count(charToCheck)
        print("Of all the given strings '"'{}'"' has largest occurence of '"'{}'"' with count {} ".format(str1, charToCheck, count))
    