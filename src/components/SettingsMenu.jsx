import { useState, useRef } from "react";
import { exportBackup, importBackup } from "../lib/storage";

/**
 * Minimal settings gear icon with export/import functionality.
 * Positioned in the top-right corner, subtle and non-intrusive.
 */
export default function SettingsMenu({ onImport, state }) {
  const [isOpen, setIsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    exportBackup(state);
    setIsOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newState = await importBackup(file);
      setImportStatus("success");
      onImport(newState);
      setTimeout(() => {
        setImportStatus(null);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setImportStatus("error");
      setTimeout(() => setImportStatus(null), 3000);
    }

    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="relative">
      {/* Gear icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg transition-all duration-200
          text-slate-500 hover:text-slate-300 hover:bg-white/5
          ${isOpen ? "bg-white/5 text-slate-300" : ""}
        `}
        title="Settings"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a28] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-slate-300 hover:bg-white/5 transition-colors"
            >
              <span className="text-base">📦</span>
              Export Backup
            </button>

            <div className="h-px bg-white/5" />

            <button
              onClick={handleImportClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-mono text-slate-300 hover:bg-white/5 transition-colors"
            >
              <span className="text-base">📂</span>
              Import Backup
            </button>

            {importStatus && (
              <>
                <div className="h-px bg-white/5" />
                <div
                  className={`px-4 py-2 text-xs font-mono ${
                    importStatus === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {importStatus === "success"
                    ? "✓ Backup restored successfully!"
                    : "✗ Invalid backup file"}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
