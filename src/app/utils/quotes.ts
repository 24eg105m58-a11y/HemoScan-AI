const quotes = [
  "Stay hydrated and keep iron-rich meals in your routine.",
  "Healthy blood starts with daily nutrition and steady habits.",
  "Small changes in diet can make big changes in hemoglobin.",
  "Remember your supplements and follow your care plan.",
  "Track your symptoms and listen to your body.",
  "Save your blood health by prioritizing sleep and balanced meals.",
  "Consistency is the best medicine for long-term wellness.",
  "Check your iron intake when energy feels low.",
  "Healthy routines today support stronger results tomorrow.",
  "Your blood health is a daily investment.",
];

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
