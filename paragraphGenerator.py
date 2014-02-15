import random
def main():
	wordsFile = open('wordsEn.txt')
	largeFile = open('out.txt', 'w')
	words = []

	for x in wordsFile:
		words.append(x.strip())
	l = len(words)

	for x in xrange(3000):
		for y in xrange(1000):
			largeFile.write(words[random.randint(0,l) - 1] + " ")


if __name__ == "__main__":
	main()