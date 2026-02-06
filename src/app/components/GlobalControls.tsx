import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { api } from "../api/client";
import { clearTokens, getAccessToken, getRefreshToken, getUserEmail } from "../auth/store";
import { loadPreferences, savePreferences, type RegionOption } from "../utils/preferences";
import { type SupportedLanguage } from "../utils/i18n";
import { User, LogOut } from "lucide-react";

const regions: RegionOption[] = ["US", "UK", "EU", "India", "Middle East", "SE Asia"];
const languages: SupportedLanguage[] = ["English", "Hindi", "Tamil", "Telugu", "Spanish", "Arabic"];

export function GlobalControls() {
  const navigate = useNavigate();
  const location = useLocation();
  const [region, setRegion] = useState<RegionOption>("US");
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefs = loadPreferences();
    setRegion(prefs.region);
    setLanguage(prefs.language);
    setAuthed(Boolean(getAccessToken()));
    setEmail(getUserEmail() || "");
  }, []);

  useEffect(() => {
    setAuthed(Boolean(getAccessToken()));
    setEmail(getUserEmail() || "");
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleRegion = (value: RegionOption) => {
    setRegion(value);
    savePreferences(value, language);
  };

  const handleLanguage = (value: SupportedLanguage) => {
    setLanguage(value);
    savePreferences(region, value);
  };

  const handleLogout = async () => {
    try {
      await api.logout(getRefreshToken());
    } finally {
      clearTokens();
      setAuthed(false);
      navigate("/login");
    }
  };

  return (
    <div className="fixed top-3 right-4 z-40 flex flex-nowrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
      <select
        className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm leading-none"
        value={region}
        onChange={(e) => handleRegion(e.target.value as RegionOption)}
      >
        {regions.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <select
        className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm leading-none"
        value={language}
        onChange={(e) => handleLanguage(e.target.value as SupportedLanguage)}
      >
        {languages.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      {authed ? (
        <div className="relative" ref={menuRef}>
          <Button
            size="sm"
            className="h-9 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700 shadow-sm"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 w-9 rounded-full p-0"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <User className="w-4 h-4" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-md border border-slate-200 bg-white shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500">Signed in</div>
              <div className="px-3 pb-2 text-xs text-slate-600">{email || "No email on file"}</div>
              <div className="h-px bg-slate-100" />
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/password-reset");
                }}
              >
                Change password
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/onboarding");
                }}
              >
                Settings
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2 inline-block" />
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button size="sm" onClick={() => navigate("/onboarding")}>
            Sign up
          </Button>
        </>
      )}
    </div>
  );
}
