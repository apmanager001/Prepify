/*
	Centralized score reference for gamification rules.
	Each entry contains:
		- points: number (points awarded)
		- type: 'event' | 'perMinute' | 'perSession' (how points are applied)
		- cap?: { perDay?: number, perSession?: number } (optional anti-abuse caps)
		- notes?: string (short rationale)

	Tune values to match your product/engagement goals.
*/

const SCORES = {
  completedTimer: {
    points: 10,
    type: "event",
    cap: { perDay: 20 }, // max 20 timer-complete awards per day
    notes: "Awarded when a timer reaches 0 (completed focus session).",
  },

  ambientMusicMinute: {
    points: 0.05,
    type: "perMinute",
    cap: { perDay: 60 }, // max 60 minutes worth of ambient listening points/day
    notes:
      "Award small points per minute of ambient music played while focused.",
  },

  dailyLogin: {
    points: 50,
    type: "event",
    cap: { perDay: 1 },
    notes: "Daily check-in bonus for returning users.",
  },

  streak7Bonus: {
    points: 100,
    type: "event",
    cap: { perDay: 1 },
    notes: "Bonus for maintaining a 7-day activity streak.",
  },

  createStudyGuide: {
    points: 40,
    type: "event",
    cap: { perDay: 5 },
    notes: "Creating and publishing a study guide or resource.",
  },

  completeStudyGuide: {
    points: 25,
    type: "event",
    cap: { perDay: 10 },
    notes: "Completing a study guide or module.",
  },

  correctFlashcard: {
    points: 2,
    type: "event",
    cap: { perDay: 200 },
    notes: "Per correct flashcard answer during review.",
  },

  finishPracticeTest: {
    points: 75,
    type: "event",
    cap: { perDay: 3 },
    notes: "Completing a timed practice test/quiz.",
  },

  contributionUpvote: {
    points: 15,
    type: "event",
    cap: { perDay: 50 },
    notes:
      "When another user upvotes your contribution (encourages quality content).",
  },

  referFriend: {
    points: 200,
    type: "event",
    cap: { perDay: 5 },
    notes: "Referral reward when a friend signs up (and verifies).",
  },

  profileComplete: {
    points: 30,
    type: "event",
    cap: { perDay: 1 },
    notes: "One-time reward for completing profile fields.",
  },

  dailyGoalComplete: {
    points: 60,
    type: "event",
    cap: { perDay: 1 },
    notes: "Completing a personal daily goal (e.g., 3 focus sessions).",
  },

  consistencyBonus: {
    points: 20,
    type: "event",
    cap: { perDay: 1 },
    notes: "Small reward for logging at least one focus session today.",
  },

  timeFocusedMinute: {
    points: 0.2,
    type: "perMinute",
    cap: { perDay: 240 }, // up to 4 hours of focus scoring/day
    notes:
      "Points per minute while a focus timer is active (encourages sustained attention).",
  },

  challengeWin: {
    points: 150,
    type: "event",
    cap: { perDay: 3 },
    notes: "Winning a community challenge or competition.",
  },

  badgeEarned: {
    points: 50,
    type: "event",
    cap: { perDay: 5 },
    notes: "Earning a milestone badge (first 10 timers, 30 days active, etc.).",
  },
};

// Optional helpers
const DAILY_POINT_CAP = 5000; // global daily cap to prevent gaming (tune as needed)

export { SCORES, DAILY_POINT_CAP };

export default SCORES;
