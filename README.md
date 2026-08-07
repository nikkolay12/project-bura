# 5 Card Bura

Local two-player prototype for 5 Card Bura with the target locked at 61 points.

Implemented rules:

- 36-card deck, five cards per player.
- Trump is revealed after the deal and drawn last from the stock.
- A leader can play one to five cards of the same suit.
- The answer must contain the same number of cards.
- Same-suit higher cards beat; any trump beats a non-trump; higher trump beats trump.
- Captured points use A=11, 10=10, K=4, Q=3, J=2.
- The trick winner draws first, leads next, and may claim at 61.
- A false 61 claim loses the deal.
- Five trumps in hand can be declared as Bura for an instant win.
- Development mode can run Player 2 as a deterministic dummy opponent.

Open `index.html` directly, or serve the folder over localhost for service-worker caching.
