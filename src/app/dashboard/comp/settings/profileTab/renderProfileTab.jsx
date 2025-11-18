"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Check,
  X,
  Save,
  AtSign,
  Mail,
  FileText,
  BookOpen,
  Calendar,
  Users,
  Globe,
  Link,
  Clock,
  CheckSquare,
  BarChart,
  Play,
  GraduationCap,
  School,
  Clipboard,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { sendVerificationEmail } from "../../settingsApi";
import { useProfileQuery } from "../../useProfileQuery";

const RenderProfileTab = () => {
  const { data: profileData, isLoading, isError } = useProfileQuery();
  const [userData, setUserData] = useState({
    profile: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      bio: "Passionate student focused on academic excellence",
      // avatar: null,
      createdAt: null,
      // new fields
      gradeLevel: "",
      subjects: [],
      studyGoals: [],
      availability: {
        weekdays: false,
        weekends: false,
        timesOfDay: [], // e.g. ["morning","afternoon"]
      },
      // more suggested fields
      institution: "",
      graduationYear: "",
      ageRange: "",
      currentCourse: "",
      expectedExams: [],
      expectedExamsNA: false,
      proficiency: "",
      preferredStudyStyle: [],
      goalDeadline: null,
      goalDeadlineNA: false,
      minutesPerWeek: null,
      timezone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "",
      linkedin: "",
      portfolio: "",
      publicProfile: false,
    },
  });

  React.useEffect(() => {
    if (profileData) {
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
          // merge new fields safely
          gradeLevel: profileData.gradeLevel ?? prev.profile.gradeLevel,
          subjects: profileData.subjects ?? prev.profile.subjects,
          studyGoals: profileData.studyGoals ?? prev.profile.studyGoals,
          availability: profileData.availability ?? prev.profile.availability,
          institution: profileData.institution ?? prev.profile.institution,
          graduationYear:
            profileData.graduationYear ?? prev.profile.graduationYear,
          ageRange: profileData.ageRange ?? prev.profile.ageRange,
          currentCourse:
            profileData.currentCourse ?? prev.profile.currentCourse,
          expectedExams:
            profileData.expectedExams ?? prev.profile.expectedExams,
          expectedExamsNA:
            profileData.expectedExamsNA ?? prev.profile.expectedExamsNA,
          proficiency: profileData.proficiency ?? prev.profile.proficiency,
          preferredStudyStyle:
            profileData.preferredStudyStyle ?? prev.profile.preferredStudyStyle,
          goalDeadline: profileData.goalDeadline ?? prev.profile.goalDeadline,
          goalDeadlineNA:
            profileData.goalDeadlineNA ?? prev.profile.goalDeadlineNA,
          minutesPerWeek:
            profileData.minutesPerWeek ?? prev.profile.minutesPerWeek,
          timezone: profileData.timezone ?? prev.profile.timezone,
          linkedin: profileData.linkedin ?? prev.profile.linkedin,
          portfolio: profileData.portfolio ?? prev.profile.portfolio,
          publicProfile:
            profileData.publicProfile ?? prev.profile.publicProfile,
          createdAt: profileData.createdAt || prev.profile.createdAt,
        },
      }));
    }
  }, [profileData]);

  const handleInputChange = (section, field, value) => {
    setUserData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleArrayField = (section, field, value) => {
    setUserData((prev) => {
      const arr = Array.isArray(prev[section]?.[field])
        ? [...prev[section][field]]
        : [];
      const idx = arr.indexOf(value);
      if (idx === -1) arr.push(value);
      else arr.splice(idx, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: arr,
        },
      };
    });
  };

  const toggleAvailability = (key) => {
    setUserData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        availability: {
          ...prev.profile.availability,
          [key]: !prev.profile.availability?.[key],
        },
      },
    }));
  };

  const toggleTimeOfDay = (value) => {
    setUserData((prev) => {
      const times = Array.isArray(prev.profile.availability?.timesOfDay)
        ? [...prev.profile.availability.timesOfDay]
        : [];
      const idx = times.indexOf(value);
      if (idx === -1) times.push(value);
      else times.splice(idx, 1);
      return {
        ...prev,
        profile: {
          ...prev.profile,
          availability: {
            ...prev.profile.availability,
            timesOfDay: times,
          },
        },
      };
    });
  };

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

  // Years for Graduation Year dropdown
  const YEARS = Array.from({ length: 61 }, (_, i) => 1990 + i); // 1990..2050

  // Timezones: prefer the full IANA list when available, otherwise fall back to a compact list
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

  // Try to produce a readable UTC/GMT offset for a given IANA timezone id.
  // Uses Intl.DateTimeFormat with timeZoneName when available and falls
  // back to parsing the formatted string. Returns strings like "UTC+02:00"
  // or an empty string when not available.
  const getTimezoneOffsetString = (tz) => {
    try {
      const now = new Date();
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          timeZoneName: "short",
        });
        // Try formatToParts first (more reliable for extracting the name)
        if (typeof fmt.formatToParts === "function") {
          const parts = fmt.formatToParts(now);
          const tzPart = parts.find((p) => p.type === "timeZoneName");
          if (tzPart && tzPart.value) {
            // Normalize GMT -> UTC
            return tzPart.value.replace(/^GMT/i, "UTC");
          }
        }
        // Fallback: parse the full formatted string
        const made = fmt.format(now);
        const m = made.match(/(GMT|UTC)[+-]?\d{1,2}(?::\d{2})?/i);
        if (m) return m[0].replace(/^GMT/i, "UTC");
      }
    } catch (e) {
      // ignore and fall through
    }
    return "";
  };

  const computeCompletion = () => {
    const p = userData.profile || {};
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
      isNonEmpty(p.firstName),
      isNonEmpty(p.lastName),
      isNonEmpty(p.username),
      isNonEmpty(p.email),
      isNonEmpty(p.bio),
      // isNonEmpty(p.avatar),
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

  const handleSave = async (section = "profile") => {
    // prepare payload to send to backend
    console.log(`Saving ${section} settings:`, userData[section]);
    const payload = {
      ...userData.profile,
      // ensure availability and arrays are normalized
      subjects: Array.isArray(userData.profile.subjects)
        ? userData.profile.subjects
        : [],
      studyGoals: Array.isArray(userData.profile.studyGoals)
        ? userData.profile.studyGoals
        : [],
      availability: {
        weekdays: !!userData.profile.availability?.weekdays,
        weekends: !!userData.profile.availability?.weekends,
        timesOfDay: Array.isArray(userData.profile.availability?.timesOfDay)
          ? userData.profile.availability.timesOfDay
          : [],
      },
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Status ${res.status}`);
      }
      const body = await res.json().catch(() => ({}));
      toast.success("Profile saved");
      // update local state with server canonical data
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...body.profile,
        },
      }));
    } catch (err) {
      console.error("Failed to save profile", err);
      toast.error("Failed to save profile");
    }
  };

  // const handleAvatarChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // TODO: Implement file upload to backend
  //     console.log("Avatar file selected:", file);
  //     // Update avatar preview
  //   }
  // };
  const defaultTZ =
    Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "";
  return (
    <div className="space-y-6">
      {/* Profile completion indicator */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              {userData.profile.avatar ? (
                <img
                  src={userData.profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            {/* <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label> */}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Picture
            </h3>
            {/* <p className="text-sm text-gray-600">Upload a new profile picture</p> */}
            {userData.profile.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                Created On:{" "}
                {new Date(userData.profile.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            )}
          </div>
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

      {/* Loading/Error States */}
      {isLoading && <div className="text-gray-500">Loading profile...</div>}
      {isError && <div className="text-red-500">Error loading profile.</div>}

      {/* Responsive 3-column form grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>First Name</span>
            </div>
          </label>
          <input
            type="text"
            className="input w-full"
            value={userData.profile.firstName || ""}
            onChange={(e) =>
              handleInputChange("profile", "firstName", e.target.value)
            }
            disabled={isLoading}
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Last Name</span>
            </div>
          </label>
          <input
            type="text"
            className="input w-full"
            value={userData.profile.lastName || ""}
            onChange={(e) =>
              handleInputChange("profile", "lastName", e.target.value)
            }
            disabled={isLoading}
            autoComplete="family-name"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <AtSign size={16} />
              <span>Username</span>
            </div>
          </label>
          <input
            id="username"
            type="text"
            value={userData.profile.username}
            onChange={(e) =>
              handleInputChange("profile", "username", e.target.value)
            }
            className="input"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>Email</span>
            </div>
          </label>
          <div className="flex items-center space-x-3">
            <input
              id="email"
              type="email"
              value={userData.profile.email}
              onChange={(e) =>
                handleInputChange("profile", "email", e.target.value)
              }
              className="input flex-1"
              disabled={isLoading}
              autoComplete="off"
            />

            <div className="flex items-center space-x-2">
              {userData.profile.emailVerified ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <X size={18} className="text-red-500" />
              )}

              <button
                type="button"
                onClick={async () => {
                  if (!userData.profile.email) {
                    toast.error("No email available to verify.");
                    return;
                  }
                  try {
                    await sendVerificationEmail(userData.profile.email);
                    toast.success("Verification email sent. Check your inbox.");
                  } catch (err) {
                    console.error("sendVerificationEmail error", err);
                    const msg =
                      err?.body?.message ||
                      err?.message ||
                      "Failed to send verification email.";
                    toast.error(msg);
                  }
                }}
                disabled={isLoading || userData.profile.emailVerified}
                className={`btn btn-primary rounded-xl btn-sm text-sm font-medium transition-colors ${
                  userData.profile.emailVerified
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {userData.profile.emailVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <span>Bio</span>
            </div>
          </label>
          <textarea
            id="bio"
            value={userData.profile.bio || ""}
            onChange={(e) =>
              handleInputChange("profile", "bio", e.target.value)
            }
            rows={3}
            className="textarea w-full h-32"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} />
              <span>Grade Level</span>
            </div>
          </label>
          <select
            className="select w-full"
            value={userData.profile.gradeLevel}
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
              const selected = (userData.profile.subjects || []).includes(s);
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} />
              <span>Study Goals</span>
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {STUDY_GOALS.map((g) => {
              const sel = (userData.profile.studyGoals || []).includes(g);
              return (
                <label key={g} className="inline-flex items-center space-x-2">
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

        <div className="lg:col-span-2">
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
                checked={!!userData.profile.availability?.weekdays}
                onChange={() => toggleAvailability("weekdays")}
                className="checkbox"
              />
              <span className="text-sm">Weekdays</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!userData.profile.availability?.weekends}
                onChange={() => toggleAvailability("weekends")}
                className="checkbox"
              />
              <span className="text-sm">Weekends</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            {TIMES_OF_DAY.map((t) => {
              const sel = (
                userData.profile.availability?.timesOfDay || []
              ).includes(t);
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
            value={userData.profile.institution || ""}
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
            value={userData.profile.graduationYear || ""}
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
            value={userData.profile.ageRange || ""}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Current Course / Major</span>
            </div>
          </label>
          <input
            type="text"
            className="input w-full"
            value={userData.profile.currentCourse || ""}
            onChange={(e) =>
              handleInputChange("profile", "currentCourse", e.target.value)
            }
          />
        </div>

        <div className="lg:col-span-2">
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
                checked={!!userData.profile.expectedExamsNA}
                onChange={() =>
                  handleInputChange(
                    "profile",
                    "expectedExamsNA",
                    !userData.profile.expectedExamsNA
                  )
                }
              />
              <span className="text-sm">Not applicable</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMS.map((ex) => {
              const sel = (userData.profile.expectedExams || []).includes(ex);
              const disabled = !!userData.profile.expectedExamsNA;
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
            value={userData.profile.proficiency || ""}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Play size={16} />
              <span>Preferred Study Style</span>
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {STUDY_STYLES.map((s) => {
              const sel = (userData.profile.preferredStudyStyle || []).includes(
                s
              );
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
                checked={!!userData.profile.goalDeadlineNA}
                onChange={() =>
                  handleInputChange(
                    "profile",
                    "goalDeadlineNA",
                    !userData.profile.goalDeadlineNA
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
              value={userData.profile.goalDeadline || ""}
              onChange={(e) =>
                handleInputChange("profile", "goalDeadline", e.target.value)
              }
              disabled={isLoading || !!userData.profile.goalDeadlineNA}
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
            value={userData.profile.minutesPerWeek || ""}
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
            value={userData.profile.timezone || defaultTZ}
            onChange={(e) =>
              handleInputChange("profile", "timezone", e.target.value)
            }
          >
            <option value="">(Use browser/default)</option>
            {TIMEZONES.map((tz) => {
              const offset = getTimezoneOffsetString(tz);
              return (
                <option key={tz} value={tz}>
                  {tz}
                  {offset ? ` (${offset})` : ""}
                </option>
              );
            })}
          </select>
        </div>

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
            value={userData.profile.linkedin || ""}
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
            value={userData.profile.portfolio || ""}
            onChange={(e) =>
              handleInputChange("profile", "portfolio", e.target.value)
            }
          />
          <p className="validator-hint">Must be valid URL</p>
        </div>

        <div className="lg:col-span-3">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!userData.profile.publicProfile}
              onChange={() =>
                handleInputChange(
                  "profile",
                  "publicProfile",
                  !userData.profile.publicProfile
                )
              }
              className="checkbox"
            />
            <span className="text-sm">
              Show my profile on leaderboards/community (public)
            </span>
          </label>
        </div>

        <div className="lg:col-span-3 flex justify-end">
          <button
            onClick={() => handleSave("profile")}
            className="bg-primary text-white btn btn-primary rounded-xl font-extrabold transition-colors"
            disabled={isLoading}
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenderProfileTab;
