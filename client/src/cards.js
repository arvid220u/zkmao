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
export const RANKS = [
  RANK.ACE,
  RANK.TWO,
  RANK.THREE,
  RANK.FOUR,
  RANK.FIVE,
  RANK.SIX,
  RANK.SEVEN,
  RANK.EIGHT,
  RANK.NINE,
  RANK.TEN,
  RANK.JACK,
  RANK.QUEEN,
  RANK.KING,
]; // dont do Object.values because we want to guarantee order
export const SUIT = {
  SPADES: "spades",
  HEARTS: "hearts",
  DIAMONDS: "diamonds",
  CLUBS: "clubs",
};
export const SUITS = [SUIT.SPADES, SUIT.HEARTS, SUIT.DIAMONDS, SUIT.CLUBS]; // dont do Object.values because we want to guarantee order

export const VOID_CARD = "VOID_CARD";

//      card is represented by {rank:, suit:} (why no types :(((()))))

export function orderedDeck(startFromRankIndex) {
  if (!startFromRankIndex) startFromRankIndex = 0;
  let deck = [];
  let suit_index = 0;
  let index = 0;
  for (const suit of SUITS) {
    let rank_index = 0;
    for (const rank of RANKS) {
      if (rank_index >= startFromRankIndex) {
        deck.push({ rank, suit, rank_index, suit_index, index });
      }
      rank_index++;
      index++;
    }
    suit_index++;
  }
  return deck;
}

export function shuffledDeck(rng, startFromRankIndex) {
  let deck = orderedDeck(startFromRankIndex);
  return utils.shuffle(deck, rng);
}

// users: list of IDs for each user who wants a card
// return: an object {user_id -> array of cards}, as even as possible, union is all cards, disjoint
export function dealShuffledCards(users, rng, startFromRankIndex) {
  let deck = shuffledDeck(rng, startFromRankIndex);
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

export function serializeCard(card) {
  const aceOfSpades = "🂡";
  const firstChar = aceOfSpades.charCodeAt(0);
  const secondChar = aceOfSpades.charCodeAt(1);
  return (
    String.fromCharCode(firstChar) +
    String.fromCharCode(
      secondChar +
        card.rank_index +
        card.suit_index * 16 +
        (card.rank === RANK.QUEEN || card.rank === RANK.KING ? 1 : 0)
    )
  );
}
export function deserializeCard(cardstr) {
  const aceOfSpades = "🂡";
  const secondCharSpades = aceOfSpades.charCodeAt(1);
  const secondChar = cardstr.charCodeAt(1);
  const diff = secondChar - secondCharSpades;
  const suit_index = Math.floor(diff / 16);
  let rank_index = diff % 16;
  if (rank_index >= 12) {
    rank_index--;
  }
  return {
    suit: SUITS[suit_index],
    rank: RANKS[rank_index],
    suit_index,
    rank_index,
    index: suit_index * 13 + rank_index,
  };
}

export function computeCardIndex(card) {
  return card === VOID_CARD ? 52 : card.index;
}

export function serializeCardASCII(card) {
  return card.rank + card.suit.charAt(0).toUpperCase();
}

export function serializeDeck(deck) {
  let deckstr = "";
  for (const card of deck) {
    deckstr += serializeCard(card);
  }
  return deckstr;
}

export function sameCard(c1, c2) {
  if (c1 === VOID_CARD || c2 === VOID_CARD)
    return c1 === VOID_CARD && c2 === VOID_CARD;
  return c1.index === c2.index;
}
