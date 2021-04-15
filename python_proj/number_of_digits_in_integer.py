count = 0
givenNumber = int(input("Enter a number for counting digits : "))
tempNum = givenNumber
while (tempNum > 0) :
    tempNum = tempNum/10
    count = count + 1

print("Number of digits in the given Integer %5d is: %5d " %(givenNumber, count))