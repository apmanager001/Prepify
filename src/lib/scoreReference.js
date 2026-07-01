const SCORES = {
  completedTimer: {
    coins: 10,
    type: "completedTimer",
    perDay: 20, // max 20 timer-complete awards per day
    notes: "Awarded when a timer reaches 0 (completed focus session).",
  },
  dailyLogin: {
    coins: 50,
    type: "dailyLogin",
    perDay: 1,
    notes: "Daily check-in bonus for returning users.",
  },
  streak7Bonus: {
    coins: 100,
    type: "streak7Bonus",
    perDay: 1,
    notes: "Bonus for maintaining a 7-day activity streak.",
  },
  referFriend: {
    coins: 200,
    type: "referFriend",
    perDay: 5,
    notes: "Referral reward when a friend signs up (and verifies).",
  },
  profileComplete: {
    coins: 30,
    type: "profileComplete",
    perDay: 1,
    notes: "One-time reward for completing profile fields.",
  },
  dailyGoalComplete: {
    coins: 60,
    type: "dailyGoalComplete",
    perDay: 1,
    notes: "Completing a personal daily goal (e.g., 3 focus sessions).",
  },
  addCalendarEvent: {
    coins: 15,
    type: "addCalendarEvent",
    perDay: 5,
    notes: "Adding a study-related event to your calendar.",
  },
  addToDoItem: {
    coins: 10,
    type: "addToDoItem",
    perDay: 5,
    notes: "Adding a task to your to-do list.",
  },
  addNotesItem: {
    coins: 8,
    type: "addNotesItem",
    perDay: 10,
    notes: "Adding a note or resource to your study notes.",
  },
  // ambientMusicMinute: {
  //   coins: 0.05,
  //   type: "perMinute",
  //   cap: { perDay: 60 }, // max 60 minutes worth of ambient listening coins/day
  //   notes:
  //     "Award small coins per minute of ambient music played while focused.",
  // },
  // createStudyGuide: {
  //   coins: 40,
  //   type: "event",
  //   cap: { perDay: 5 },
  //   notes: "Creating and publishing a study guide or resource.",
  // },

  // completeStudyGuide: {
  //   coins: 25,
  //   type: "event",
  //   cap: { perDay: 10 },
  //   notes: "Completing a study guide or module.",
  // },

  // correctFlashcard: {
  //   coins: 2,
  //   type: "event",
  //   cap: { perDay: 200 },
  //   notes: "Per correct flashcard answer during review.",
  // },

  // finishPracticeTest: {
  //   coins: 75,
  //   type: "event",
  //   cap: { perDay: 3 },
  //   notes: "Completing a timed practice test/quiz.",
  // },

  // contributionUpvote: {
  //   coins: 15,
  //   type: "event",
  //   cap: { perDay: 50 },
  //   notes:
  //     "When another user upvotes your contribution (encourages quality content).",
  // },
  // consistencyBonus: {
  //   coins: 20,
  //   type: "event",
  //   cap: { perDay: 1 },
  //   notes: "Small reward for logging at least one focus session today.",
  // },

  // timeFocusedMinute: {
  //   coins: 0.2,
  //   type: "perMinute",
  //   cap: { perDay: 240 }, // up to 4 hours of focus scoring/day
  //   notes:
  //     "Coins per minute while a focus timer is active (encourages sustained attention).",
  // },

  // challengeWin: {
  //   coins: 150,
  //   type: "event",
  //   cap: { perDay: 3 },
  //   notes: "Winning a community challenge or competition.",
  // },

  // badgeEarned: {
  //   coins: 50,
  //   type: "event",
  //   cap: { perDay: 5 },
  //   notes: "Earning a milestone badge (first 10 timers, 30 days active, etc.).",
  // },
};

// Optional helpers
const DAILY_COIN_CAP = 5000; // global daily cap to prevent gaming (tune as needed)

export { SCORES, DAILY_COIN_CAP };

export default SCORES;
