// Fan extras: Journal entries unlocked by puzzles and hidden easter eggs.
// All titles and texts are original nods to the games, not quotes.

export const ACHIEVEMENTS = [
  {
    id: "medallion",
    title: "The medallion trembles",
    hint: "Something on the welcome page reacts when touched.",
    text: "You tapped the wolf medallion until it hummed. Magic is near.",
  },
  {
    id: "gwent",
    title: "Fancy a round?",
    hint: "Type the name of a certain card game, anywhere on the site.",
    text: "Every innkeeper on the Continent wants a game of cards with you.",
  },
  {
    id: "rooftop",
    title: "How did she get up there?",
    hint: "Somewhere among the Locations, look up.",
    text: "You found Roach standing on a rooftop. Again.",
  },
  {
    id: "travellers",
    title: "Friends on the road",
    hint: "Greet everyone you meet on the Story road.",
    text: "A pedlar, a stray dog and one very wet drowner — all greeted.",
  },
  {
    id: "ride",
    title: "To the end of the Path",
    hint: "Ride Roach all the way through the story.",
    text: "From the Conjunction of the Spheres to the Wild Hunt, in one ride.",
  },
  {
    id: "trial",
    title: "Trial of the Signs",
    hint: "Pass five rounds of the Signs trial.",
    text: "Five sign sequences repeated without a single mistake.",
  },
  {
    id: "quiz",
    title: "Ready for the contract",
    hint: "Name three monsters' classes in a row in the Bestiary.",
    text: "Three monsters identified in a row. The notice board awaits.",
  },
  {
    id: "senses",
    title: "Nothing escapes your senses",
    hint: "Use Witcher Senses to find every hidden clue.",
    text: "Every claw mark on the wiki found and followed.",
  },
];

/** Hidden clues for the Witcher Senses hunt; `where` is shown in the Journal. */
export const CLUES = [
  { id: "home", where: "Home" },
  { id: "characters", where: "Characters" },
  { id: "monsters", where: "Bestiary" },
  { id: "signs", where: "Signs" },
  { id: "story", where: "The Story" },
];
