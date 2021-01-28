import * as utils from "./utils.js";

export const RANK = {
  ACE: "A",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",
  TEN: "10",
  JACK: "J",
  QUEEN: "Q",
  KING: "K",
};
export const RANKS = Object.values(RANK);
export const SUIT = {
  SPADES: "spades",
  CLUBS: "clubs",
  DIAMONDS: "diamonds",
  HEARTS: "hearts",
};
export const SUITS = Object.values(SUIT);

//      card is represented by {rank:, suit:} (why no types :(((()))))

export function orderedDeck() {
  let deck = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function shuffledDeck(rng) {
  let deck = orderedDeck();
  return utils.shuffle(deck, rng);
}

// users: list of IDs for each user who wants a card
// return: an object {user_id -> array of cards}, as even as possible, union is all cards, disjoint
export function dealShuffledCards(users, rng) {
  let deck = shuffledDeck(rng);
  let cards = {};
  let index = 0;
  for (const user of users) {
    cards[user] = [];
  }
  while (index < deck.length) {
    for (const user of users) {
      cards[user].push(deck[index]);
      index++;
    }
  }
  return cards;
}
