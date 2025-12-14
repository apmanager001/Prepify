"use client";
import React, { useEffect, useState } from "react";
import { User, Check, X, Save, AtSign, Mail, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfile } from "../../settingsApi";
import { useProfileQuery } from "../../useProfileQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingComp from "@/lib/loading";

const RenderProfileTab = () => {
  const { data: profileData, isLoading, isError } = useProfileQuery();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Profile saved");
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Failed to save profile", error);
      toast.error("Failed to save profile");
    },
  });
  const [userData, setUserData] = useState({
    profile: {
      firstname: "Please set your first name",
      lastname: "Please set your last name",
      email: "john.doe@example.com",
      username: "johndoe",
      screenname: "Please set your screen name",
      bio: "Passionate student focused on academic excellence",
      // avatar: null,
      createdAt: null,
    },
  });

  React.useEffect(() => {
    if (profileData) {
      setUserData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profileData,
          publicProfile:
            profileData.publicProfile ?? prev.profile.publicProfile,
          screenname: profileData.screenname ?? prev.profile.screenname,
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

  const handleSave = async (section = "profile") => {
    // prepare payload to send to backend
    const payload = {
      ...userData.profile,
      // Ensure publicProfile is included
      publicProfile: userData.profile.publicProfile,
    };

    mutation.mutate(payload);
  };

  // const handleAvatarChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // TODO: Implement file upload to backend
  //     console.log("Avatar file selected:", file);
  //     // Update avatar preview
  //   }
  // };

  if (isLoading) {
    return <div className="text-gray-500 min-h-24 flex items-center justify-center"><LoadingComp /></div>;
  }
  if (isError) {
    return <div className="text-red-500 min-h-24">Error loading profile.</div>;
  }
  return (
    <div className="space-y-6">
      {/* Profile completion indicator */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
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
      </div>

      {/* Responsive 3-column form grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>First Name</span>
            </div>
          </label>
          <input
            type="text"
            id='firstname'
            className="input w-full"
            value={userData.profile.firstname || ""}
            onChange={(e) =>
              handleInputChange("profile", "firstname", e.target.value)
            }
            disabled={isLoading}
            autoComplete="given-name"
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-4">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Last Name</span>
            </div>
          </label>
          <input
            type="text"
            id='lastname'
            className="input w-full"
            value={userData.profile.lastname || ""}
            onChange={(e) =>
              handleInputChange("profile", "lastname", e.target.value)
            }
            disabled={isLoading}
            autoComplete="family-name"
          />
        </div>
        <div>
          <label
            htmlFor="screenname"
            className="block text-sm font-medium text-gray-700"
          >
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Screen Name</span>
            </div>
          </label>
          <p className="text-xs text-gray-500 ml-4">
            For displaying on leaderboard
          </p>
          <input
            id="screenname"
            type="text"
            value={userData.profile.screenName || ""}
            onChange={(e) =>
              handleInputChange("profile", "screenName", e.target.value)
            }
            className="input w-full"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <div className="lg:col-span-3 md:col-span-2">
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
        <div className="flex justify-between lg:col-span-3 md:col-span-2 items-center">
          <label htmlFor="public-profile-toggle" className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              id='public-profile-toggle'
              checked={!!userData.profile.publicProfile}
              onChange={() =>
                handleInputChange(
                  "profile",
                  "publicProfile",
                  !userData.profile.publicProfile
                )
              }
              className="toggle"
            />
            <span className="text-sm">
              Show my profile on leaderboards/community (public)
            </span>
          </label>
          <button
            onClick={() => handleSave("profile")}
            className="bg-primary text-white btn btn-primary rounded-xl font-extrabold transition-colors"
            disabled={isLoading || mutation.isPending}
          >
            <Save size={16} />
            <span>{mutation.isPending ? "Saving..." : "Save Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenderProfileTab;
