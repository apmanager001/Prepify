import React, { useState } from "react";
import { useAddTimerMutation } from "./useAddTimerMutation";
import { X } from "lucide-react";

const AddTimerModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState(5);

  const addTimerMutation = useAddTimerMutation({
    onSuccess: (data) => {
      onCreate && onCreate(data);
      setName("");
      setMinutes(5);
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !minutes) return;
    addTimerMutation.mutate({
      name,
      minutes: Number(minutes),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold ">Create New Timer</h2>
            <button className="btn btn-circle btn-ghost">
                <X className="fix top-4 right-4 cursor-pointer" size={20} onClick={onClose} />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minutes</label>
            <div className="flex gap-2 justify-center items-center mt-2 flex-wrap">
              {[5, 10, 15, 20, 25, 30, 45, 60].map((min) => (
                <button
                  type="button"
                  key={min}
                  className={`btn rounded-2xl duration-100 ${
                    minutes === min
                      ? "bg-primary text-white border-primary"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary/10"
                  }`}
                  onClick={() => setMinutes(min)}
                >
                  {min}
                </button>
              ))}
             
            </div>
            <div className="w-full flex justify-center items-center mt-4">
                <input
                    type="number"
                    min="1"
                    max="120"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="w-16 px-2 py-2 border rounded-lg ml-2"
                    required
                />
                <span className="ml-1 text-sm text-gray-500">min</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-primary btn-soft rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-lg"
              disabled={addTimerMutation.isLoading}
            >
              {addTimerMutation.isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimerModal;
