package main

func main() {
	// // var card string = "Ace of Spades"
	// //card := "Ace of Spades"
	// //card = "Five of Diamonds"
	// card := newCard()
	// fmt.Println(card)

	// //Using deck.go slice
	// cards := deck{"Ace of Diamonds", newCard()}
	// cards.print()

	cards := newDeck()

	hand, remainingCards := deal(cards, 5)

	hand.print()
	remainingCards.print()
}

// func newCard() string {
// 	return "Five of Diamonds"
// }

// func main() {
// 	var deckSize int
// 	deckSize = 52
// 	fmt.Println(deckSize)
// }

// var deckSize int

// func main() {
// 	deckSize = 50
// 	fmt.Println(deckSize)
// }

// //Slices : Array that can grow/shrink, Array: constant once declared & added
// cards := []string{"Ace of Diamonds", newCard()}
// cards = append(cards, "Six of Spades")

// for i, card := range cards {
// 	fmt.Println(i, card)
// }
