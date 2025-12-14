import React, { useState } from "react";
import { Hammer } from "lucide-react";
import { CompactPlayer, TimerMini } from "../comp/dashboardComps/toolsFooter";

const Tools = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed right-4 bottom-4 z-50 tooltip tooltip-top"
      data-tip="Tools"
    >
      <div className="flex flex-col items-end gap-3">
        {/* Expanded panel that appears above the FAB when open */}
        {open && (
          <div className="mb-2 w-80 sm:w-96 bg-white rounded-lg p-3 shadow-lg border border-gray-100">
            <div className="flex flex-col gap-3">
              <div className="bg-gray-50 p-2 rounded-md">
                <CompactPlayer />
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <TimerMini />
              </div>
            </div>
          </div>
        )}

        {/* Floating FAB button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn btn-circle btn-success bg-success/40 btn-lg shadow-lg"
          aria-expanded={open}
          aria-label={open ? "Close tools" : "Open tools"}
        >
          <Hammer className="w-6 h-6 text-green-600" />
        </button>
      </div>
    </div>
  );
};

export default Tools;
