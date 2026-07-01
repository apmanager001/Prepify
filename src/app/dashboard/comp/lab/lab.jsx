"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { FlaskConical, Clock, Flame, NotebookText, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import MyNotesLab from "./myNotesLab";
import IndividualNote from "./individualNote";
import AddNoteModal from "./addNoteModal";
import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from "./notesApi";
import FocusTimer from "../../../../lib/focusTimer";
import StatsBadge from "../planner/statsBadge";

const MAX_NOTES = 10;

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const Lab = () => {
  const {
    data: notesData,
    isLoading,
    isError,
  } = useNotes({
    select: (v) => (Array.isArray(v) ? v : (v.notes ?? [])),
  });
  const notes = notesData ?? [];
  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime(),
      ),
    [notes],
  );

  const [selectedId, setSelectedId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();
  const deleteMutation = useDeleteNote();

  const selectedNote = useMemo(
    () => sortedNotes.find((n) => n._id === selectedId) ?? null,
    [sortedNotes, selectedId],
  );

  useEffect(() => {
    if (!selectedId && sortedNotes.length > 0) {
      setSelectedId(sortedNotes[0]._id);
      return;
    }

    if (selectedId && !sortedNotes.some((n) => n._id === selectedId)) {
      setSelectedId(sortedNotes[0]?._id ?? null);
    }
  }, [sortedNotes, selectedId]);

  const handleOpenAdd = () => {
    if (notes.length >= MAX_NOTES) {
      toast.error("Note limit reached");
      return;
    }
    setIsAddOpen(true);
  };

  const safeNotes = Array.isArray(sortedNotes) ? sortedNotes : [];
  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const notesCreatedThisWeek = safeNotes.filter((note) => {
    const createdAt = new Date(note?.createdAt);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= startOfWeek;
  }).length;

  const stats = [
    {
      id: 1,
      icon: (
        <div className=" text-[#f54927] rounded-lg">
          <Clock />
        </div>
      ),
      label: "Today's Focus Time",
      value: "1h 30m",
      subValue: "+20m vs yesterday",
      trend: "positive",
    },
    {
      id: 2,
      icon: <Trophy />,
      label: "Sessions Completed",
      value: "3",
      subValue: "+1 vs yesterday",
      trend: "negative",
    },
    {
      id: 3,
      icon: <Flame />,
      label: "Current Streak",
      value: "6 days",
      subValue: "Best: 10 days",
      trend: "positive",
    },
    {
      id: 4,
      icon: <NotebookText />,
      label: "Notes Saved",
      value: safeNotes.length,
      subValue: `${notesCreatedThisWeek} note${notesCreatedThisWeek === 1 ? "" : "s"} this week`,
      trend: notesCreatedThisWeek === 0 ? "negative" : "positive",
    },
  ];

  const handleAddNote = async ({ title, body }) => {
    try {
      const payload = {
        title: title.trim() || `Note ${notes.length + 1}`,
        body: body.trim() || "",
      };
      const created = await createMutation.mutateAsync(payload);
      const id = created?._id || created?.note?._id;
      if (id) setSelectedId(id);
      setIsAddOpen(false);
    } catch (err) {
      console.error("create note failed", err);
      toast.error("Failed to create note");
    }
  };

  const handleSaveEdit = async (id, payload) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      setSelectedId(id);
      toast.success("Note updated");
    } catch (err) {
      console.error("update note failed", err);
      toast.error("Failed to update note");
      throw err;
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
      toast.success("Note deleted");
    } catch (err) {
      console.error("delete note failed", err);
      toast.error("Failed to delete note");
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-55">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg p-4">
        Failed to load notes.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mb-24 xl:mb-10">
      <header className="headerContainer relative flex items-center justify-between overflow-visible">
        <div>
          <div className="text-neutral text-sm font-medium flex items-center gap-2">
            <div className="flex items-center text-neutral-content text-lg border-3 border-primary bg-neutral p-2 rounded-xl hover:scale-105">
              <FlaskConical />
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-extrabold text-neutral-content uppercase tracking-wide">
                Lab
              </span>
              <div className="text-sm text-neutral-content/80">
                Capture ideas and stay focused with powerful tools
              </div>
            </div>
          </div>
        </div>
        <Image
          src="./headerImages/labSet.webp"
          alt="Lab Illustration"
          width={220}
          height={160}
          className="hidden md:block absolute bottom-0 right-5 w-60 h-22"
        />
      </header>
      <div className={`grid grid-cols-1 w-full gap-2 ${roboto.className}`}>
        {/* Full-width top row */}
        <div>
          <StatsBadge stats={stats} />
        </div>

        {/* Main row */}
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
          <div className="lg:col-span-3 min-[1201px]:col-span-3">
            <MyNotesLab
              notes={sortedNotes}
              selectedId={selectedId}
              onSelectNote={setSelectedId}
              onOpenAddNote={handleOpenAdd}
            />
          </div>

          <div className="lg:col-span-5 min-[1201px]:col-span-6">
            <IndividualNote
              selectedNote={selectedNote}
              onSaveEdit={handleSaveEdit}
              saving={updateMutation.isPending}
              onDeleteNote={handleDeleteNote}
              deleting={deleteMutation.isPending}
            />
          </div>

          <div className="lg:col-span-4 min-[1201px]:col-span-3">
            <FocusTimer />
          </div>
        </div>
      </div>

      <AddNoteModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={handleAddNote}
        saving={createMutation.isPending}
      />
    </div>
  );
};

export default Lab;
