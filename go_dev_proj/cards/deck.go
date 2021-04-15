package main

import (
	"fmt"
)

//create a new type of "deck" which is a slice of strings
type deck []string

//any variable of type "deck" gets access to this function
func (d deck) print() {
	for index, card := range d {
		fmt.Println(index, card)
	}
}

//We don't add received to this function as we are planning to create a new deck
func newDeck() deck {
	cards := deck{}

	cardSuits := []string{"Spades", "Diamonds", "Hearts", "Clubs"}
	cardValues := []string{"Ace", "Two", "Three", "Four"}

	//As we are not going to use indexes i & j so replace with _ (underscore)
	for _, suit := range cardSuits {
		for _, value := range cardValues {
			cards = append(cards, value+" of"+suit)
		}
	}
	return cards
}

//Return everything in deck until handsize, everything deck from handSize
func deal(d deck, handSize int) (deck, deck) {
	return d[:handSize], d[handSize:]
}
