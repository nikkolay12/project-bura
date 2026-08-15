// Edit this file to tune the dummy opponent. "rules" are descriptions only;
// "tuning" values are read by app.js during the bot's decisions.
window.BURA_BOT_RULES = {
  rules: {
    cardMemory: [
      "The bot remembers every visible played card, including captured tricks and table cards.",
      "It treats every card not in its hand and not yet played as potentially held by the opponent or remaining in stock.",
      "It counts unseen trumps and unseen 10s and aces before valuing a move."
    ],
    leading: [
      "A lead always uses one suit and never contains more cards than the opponent currently holds.",
      "The bot prefers low, non-trump cards early while stock remains.",
      "When it has a safe low two- or three-card group in one non-trump suit, it prefers to lead the whole group to pressure the opponent and clear its hand faster.",
      "When it has four cards of one suit, it nearly always leads all four when the group contains a 10 or ace, or when most trumps have already been played.",
      "It avoids leading a lone trump while stock remains if it has a reasonable non-trump lead available.",
      "It keeps trumps and valuable cards unless the deal is late, the move is likely to win, or it can reach 61.",
      "It avoids risky multi-card leads when many unseen trumps can cut them."
    ],
    answering: [
      "The bot chooses the cheapest legal set that can beat the lead when the trick is worth taking.",
      "It avoids spending trumps on low-value early tricks when stock remains.",
      "If it cannot cut, or a cut is strategically too expensive, it discards its least valuable legal cards."
    ],
    declarations: [
      "The bot immediately declares Bura when it has all five trumps.",
      "The bot immediately declares Bura when it has all five cards of the same suit",
      "After winning a trick, it claims only when it has at least 61 points; otherwise it continues."
    ],
    dealWeight: [
      "The bot offers an increase from a strong position, near a match-winning score, after a strong captured trick, or with Bura/Maliutka strength.",
      "It accepts an increase when its position is sound, but declines when the opponent could win the match and the bot is weak."
    ]
  },
  tuning: {
    highRanks: ["10", "A"],
    safePair: {
      maxLeadRisk: 0.42,
      maxTotalPoints: 4,
      minimumStockRemaining: 5,
      scoreBonus: 18
    },
    multiLead: {
      maxLeadRisk: 0.58,
      lowCardBonus: 30,
      twoCardBonus: 16,
      threeCardBonus: 28
    },
    fourCardLead: {
      maxLeadRisk: 0.76,
      remainingTrumpsForPressure: 4,
      highCardBonus: 72,
      trumpExhaustedBonus: 64
    },
    trumpLead: {
      minimumStockForSinglePenalty: 1,
      singleLeadPenalty: 96,
      earlyGroupPenalty: 18,
      groupLeadStockThreshold: 5,
      lateGroupBonus: 14
    }
  }
};
