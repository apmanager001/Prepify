import React, { useState } from "react";
import {
  GraduationCap,
  Clipboard,
  CheckSquare,
  Clock,
  School,
  Calendar,
  Users,
  BookOpen,
  BarChart,
  Play,
  Globe,
  Link,
} from "lucide-react";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Languages",
  "Computer Science",
];
const STUDY_GOALS = [
  "Improve Grades",
  "Prepare for Exam",
  "Learn New Skill",
  "Daily Practice",
];
const TIMES_OF_DAY = ["morning", "afternoon", "evening"];
const EXAMS = ["SAT", "ACT", "AP", "GRE", "GMAT", "TOEFL", "IELTS"];
const STUDY_STYLES = ["Video", "Text", "Practice Problems", "Group Study"];
const STUDY_RANGES = [
  { value: "0-15", label: "0–15 minutes" },
  { value: "15-30", label: "15–30 minutes" },
  { value: "30-45", label: "30–45 minutes" },
  { value: "60-120", label: "1–2 hours" },
  { value: "120-180", label: "2–3 hours" },
  { value: "180-300", label: "3–5 hours" },
  { value: "300-600", label: "5–10 hours" },
  { value: "600-1200", label: "10–20 hours" },
  { value: "1200+", label: "20+ hours" },
];
const YEARS = Array.from({ length: 61 }, (_, i) => 1990 + i);
const TIMEZONES =
  typeof Intl !== "undefined" && Intl.supportedValuesOf
    ? Intl.supportedValuesOf("timeZone")
    : [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Asia/Kolkata",
        "Asia/Shanghai",
        "Asia/Tokyo",
        "Australia/Sydney",
      ];

const DEFAULT_PROFILE = {
  gradeLevel: "",
  subjects: [],
  studyGoals: [],
  availability: { weekdays: false, weekends: false, timesOfDay: [] },
  institution: "",
  graduationYear: "",
  ageRange: "",
  currentCourse: "",
  expectedExams: [],
  expectedExamsNA: false,
  proficiency: "",
  preferredStudyStyle: [],
  goalDeadline: "",
  goalDeadlineNA: false,
  minutesPerWeek: "",
  timezone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "",
  linkedin: "",
  portfolio: "",
  publicProfile: false,
};

const StudyGoalsTab = ({
  profile: propProfile,
  handleInputChange: propHandleInputChange,
  toggleArrayField: propToggleArrayField,
  toggleAvailability: propToggleAvailability,
  toggleTimeOfDay: propToggleTimeOfDay,
  handleSave: propHandleSave,
  isLoading = false,
}) => {
  const [localProfile, setLocalProfile] = useState(
    propProfile || DEFAULT_PROFILE
  );
  const profile = propProfile || localProfile;

  const handleInputChange = (section, field, value) => {
    if (typeof propHandleInputChange === "function") {
      return propHandleInputChange(section, field, value);
    }
    // local fallback (component edits `profile` fields)
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (section, field, value) => {
    if (typeof propToggleArrayField === "function") {
      return propToggleArrayField(section, field, value);
    }
    setLocalProfile((prev) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
      const idx = arr.indexOf(value);
      if (idx === -1) arr.push(value);
      else arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const toggleAvailability = (key) => {
    if (typeof propToggleAvailability === "function")
      return propToggleAvailability(key);
    setLocalProfile((prev) => ({
      ...prev,
      availability: { ...prev.availability, [key]: !prev.availability?.[key] },
    }));
  };

  const toggleTimeOfDay = (value) => {
    if (typeof propToggleTimeOfDay === "function")
      return propToggleTimeOfDay(value);
    setLocalProfile((prev) => {
      const times = Array.isArray(prev.availability?.timesOfDay)
        ? [...prev.availability.timesOfDay]
        : [];
      const idx = times.indexOf(value);
      if (idx === -1) times.push(value);
      else times.splice(idx, 1);
      return {
        ...prev,
        availability: { ...prev.availability, timesOfDay: times },
      };
    });
  };

  const handleSave = (name) => {
    if (typeof propHandleSave === "function") return propHandleSave(name);
    // local fallback: no-op
  };
  const {
    gradeLevel,
    subjects = [],
    studyGoals = [],
    availability = {},
    institution,
    graduationYear,
    ageRange,
    currentCourse,
    expectedExams = [],
    expectedExamsNA,
    proficiency,
    preferredStudyStyle = [],
    goalDeadline,
    goalDeadlineNA,
    minutesPerWeek,
    timezone,
    linkedin,
    portfolio,
    publicProfile,
  } = profile || {};


//   React.useEffect(() => {
//       if (profileData) {
//         setUserData((prev) => ({
//           ...prev,
//           profile: {
//             ...prev.profile,
//             ...profileData,
//             // merge new fields safely
//             gradeLevel: profileData.gradeLevel ?? prev.profile.gradeLevel,
//             subjects: profileData.subjects ?? prev.profile.subjects,
//             studyGoals: profileData.studyGoals ?? prev.profile.studyGoals,
//             availability: profileData.availability ?? prev.profile.availability,
//             institution: profileData.institution ?? prev.profile.institution,
//             graduationYear:
//               profileData.graduationYear ?? prev.profile.graduationYear,
//             ageRange: profileData.ageRange ?? prev.profile.ageRange,
//             currentCourse:
//               profileData.currentCourse ?? prev.profile.currentCourse,
//             expectedExams:
//               profileData.expectedExams ?? prev.profile.expectedExams,
//             expectedExamsNA:
//               profileData.expectedExamsNA ?? prev.profile.expectedExamsNA,
//             proficiency: profileData.proficiency ?? prev.profile.proficiency,
//             preferredStudyStyle:
//               profileData.preferredStudyStyle ?? prev.profile.preferredStudyStyle,
//             goalDeadline: profileData.goalDeadline ?? prev.profile.goalDeadline,
//             goalDeadlineNA:
//               profileData.goalDeadlineNA ?? prev.profile.goalDeadlineNA,
//             minutesPerWeek:
//               profileData.minutesPerWeek ?? prev.profile.minutesPerWeek,
//             timezone: profileData.timezone ?? prev.profile.timezone,
//             linkedin: profileData.linkedin ?? prev.profile.linkedin,
//             portfolio: profileData.portfolio ?? prev.profile.portfolio,
//             publicProfile:
//               profileData.publicProfile ?? prev.profile.publicProfile,
//             createdAt: profileData.createdAt || prev.profile.createdAt,
//           },
//         }));
//       }
//     }, [profileData]);


   const computeCompletion = () => {
     const p = profile || {};
     const isNonEmpty = (val) => {
       if (val === null || val === undefined) return false;
       if (typeof val === "string") return val.trim() !== "";
       if (Array.isArray(val)) return val.length > 0;
       return true;
     };

     const availabilityFilled = !!(
       p.availability?.weekdays ||
       p.availability?.weekends ||
       (Array.isArray(p.availability?.timesOfDay) &&
         p.availability.timesOfDay.length > 0)
     );

     const checks = [
       isNonEmpty(p.gradeLevel),
       Array.isArray(p.subjects) && p.subjects.length > 0,
       Array.isArray(p.studyGoals) && p.studyGoals.length > 0,
       availabilityFilled,
       isNonEmpty(p.institution),
       isNonEmpty(p.graduationYear),
       isNonEmpty(p.ageRange),
       isNonEmpty(p.currentCourse),
       (Array.isArray(p.expectedExams) && p.expectedExams.length > 0) ||
         !!p.expectedExamsNA,
       isNonEmpty(p.proficiency),
       Array.isArray(p.preferredStudyStyle) && p.preferredStudyStyle.length > 0,

       isNonEmpty(p.goalDeadline) || !!p.goalDeadlineNA,
       isNonEmpty(p.minutesPerWeek),
       isNonEmpty(p.timezone),
       // count at least one of linkedin or portfolio as filled
       !!(isNonEmpty(p.linkedin) || isNonEmpty(p.portfolio)),
     ];

     const total = checks.length;
     const filled = checks.filter(Boolean).length;
     return total === 0 ? 0 : Math.round((filled / total) * 100);
   };

    //  const defaultTZ =
    //    Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "";
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/80 rounded-lg shadow-sm border border-gray-100 flex gap-4">
        <div>
          <h2 className="text-lg font-semibold">Study Goals & Preferences</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Configure your study profile so Prepify can suggest and customize
            study tools, schedules, and resources tailored to your goals. Fill
            out your grade level, subjects, availability and preferred study
            styles, then save to apply recommendations across the app.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 relative">
            <svg viewBox="0 0 36 36" className="w-12 h-12">
              <path
                d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray={`${computeCompletion()} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="text-sm">
            <div className="font-semibold">Profile</div>
            <div className="text-xs text-gray-500">
              {computeCompletion()}% complete
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  <span>Grade Level</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={gradeLevel || ""}
                onChange={(e) =>
                  handleInputChange("profile", "gradeLevel", e.target.value)
                }
              >
                <option value="">Select grade level</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
                <option value="undergrad">Undergraduate</option>
                <option value="graduate">Graduate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clipboard size={16} />
                  <span>Subjects</span>
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => {
                  const selected = subjects.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleArrayField("profile", "subjects", s)}
                      className={`btn btn-sm rounded-full ${
                        selected ? "btn-primary text-white" : "btn-ghost"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare size={16} />
                  <span>Study Goals</span>
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {STUDY_GOALS.map((g) => {
                  const sel = studyGoals.includes(g);
                  return (
                    <label
                      key={g}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={() =>
                          toggleArrayField("profile", "studyGoals", g)
                        }
                        className="checkbox"
                      />
                      <span className="text-sm">{g}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Availability</span>
            </div>
          </label>
          <div className="flex items-center gap-4 mb-2">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!availability?.weekdays}
                onChange={() => toggleAvailability("weekdays")}
                className="checkbox"
              />
              <span className="text-sm">Weekdays</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!availability?.weekends}
                onChange={() => toggleAvailability("weekends")}
                className="checkbox"
              />
              <span className="text-sm">Weekends</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            {TIMES_OF_DAY.map((t) => {
              const sel = (availability?.timesOfDay || []).includes(t);
              return (
                <label key={t} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sel}
                    onChange={() => toggleTimeOfDay(t)}
                    className="checkbox"
                  />
                  <span className="text-sm capitalize">{t}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <School size={16} />
                  <span>Institution</span>
                </div>
              </label>
              <input
                type="text"
                className="input w-full"
                value={institution || ""}
                onChange={(e) =>
                  handleInputChange("profile", "institution", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Graduation Year</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={graduationYear || ""}
                onChange={(e) =>
                  handleInputChange("profile", "graduationYear", e.target.value)
                }
              >
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Age Range</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={ageRange || ""}
                onChange={(e) =>
                  handleInputChange("profile", "ageRange", e.target.value)
                }
              >
                <option value="">Select age range</option>
                <option value="13-15">13-15</option>
                <option value="16-18">16-18</option>
                <option value="19-22">19-22</option>
                <option value="23-30">23-30</option>
                <option value="30+">30+</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>Current Course / Major</span>
                </div>
              </label>
              <input
                type="text"
                className="input w-full"
                value={currentCourse || ""}
                onChange={(e) =>
                  handleInputChange("profile", "currentCourse", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clipboard size={16} />
                    <span>Expected Exams</span>
                  </div>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={!!expectedExamsNA}
                    onChange={() =>
                      handleInputChange(
                        "profile",
                        "expectedExamsNA",
                        !expectedExamsNA
                      )
                    }
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXAMS.map((ex) => {
                  const sel = expectedExams.includes(ex);
                  const disabled = !!expectedExamsNA;
                  return (
                    <button
                      key={ex}
                      type="button"
                      onClick={() =>
                        toggleArrayField("profile", "expectedExams", ex)
                      }
                      disabled={disabled}
                      className={`btn btn-sm rounded-full ${
                        sel ? "btn-primary text-white" : "btn-ghost"
                      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {ex}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <BarChart size={16} />
                  <span>Overall Proficiency</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={proficiency || ""}
                onChange={(e) =>
                  handleInputChange("profile", "proficiency", e.target.value)
                }
              >
                <option value="">Select proficiency</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Play size={16} />
                  <span>Preferred Study Style</span>
                </div>
              </label>
              <div className="flex flex-wrap gap-2">
                {STUDY_STYLES.map((s) => {
                  const sel = preferredStudyStyle.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        toggleArrayField("profile", "preferredStudyStyle", s)
                      }
                      className={`btn btn-sm rounded-full ${
                        sel ? "btn-primary text-white" : "btn-ghost"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Goal Deadline</span>
                  </div>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={!!goalDeadlineNA}
                    onChange={() =>
                      handleInputChange(
                        "profile",
                        "goalDeadlineNA",
                        !goalDeadlineNA
                      )
                    }
                  />
                  <span className="text-sm">Not applicable</span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  className="input w-full"
                  value={goalDeadline || ""}
                  onChange={(e) =>
                    handleInputChange("profile", "goalDeadline", e.target.value)
                  }
                  disabled={isLoading || !!goalDeadlineNA}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Weekly Study Target</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={minutesPerWeek || ""}
                onChange={(e) =>
                  handleInputChange("profile", "minutesPerWeek", e.target.value)
                }
              >
                <option value="">Select range</option>
                {STUDY_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose an estimated weekly study time
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span>Timezone</span>
                </div>
              </label>
              <select
                className="select w-full"
                value={
                  timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
                }
                onChange={(e) =>
                  handleInputChange("profile", "timezone", e.target.value)
                }
              >
                <option value="">(Use browser/default)</option>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Link size={16} />
                  <span>LinkedIn URL</span>
                </div>
              </label>
              <input
                type="url"
                className="input validator w-full"
                placeholder="https://"
                value={linkedin || ""}
                onChange={(e) =>
                  handleInputChange("profile", "linkedin", e.target.value)
                }
              />
              <p className="validator-hint">Must be valid URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Link size={16} />
                  <span>Portfolio / Website</span>
                </div>
              </label>
              <input
                type="url"
                className="input validator w-full"
                placeholder="https://"
                value={portfolio || ""}
                onChange={(e) =>
                  handleInputChange("profile", "portfolio", e.target.value)
                }
              />
              <p className="validator-hint">Must be valid URL</p>
            </div>

            <div className="lg:col-span-2 flex flex-col md:flex-row gap-2 items-center justify-between">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!!publicProfile}
                  onChange={() =>
                    handleInputChange(
                      "profile",
                      "publicProfile",
                      !publicProfile
                    )
                  }
                  className="toggle"
                />
                <span className="text-sm">
                  Show my profile on leaderboards/community (public)
                </span>
              </label>
              <div>
                <button
                  onClick={() => handleSave("profile")}
                  className="bg-primary text-white btn btn-primary rounded-xl font-extrabold transition-colors"
                  disabled={isLoading}
                >
                  <span>Save Profile Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGoalsTab;
