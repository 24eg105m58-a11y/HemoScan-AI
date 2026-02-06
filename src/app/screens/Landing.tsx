import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Droplet, Activity, Heart, Shield } from "lucide-react";
import { translate, type SupportedLanguage } from "../utils/i18n";
import { getRandomQuote } from "../utils/quotes";
import { GlobalControls } from "../components/GlobalControls";
import { getAccessToken } from "../auth/store";
import { loadPreferences } from "../utils/preferences";

export function Landing() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("US");
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [quote, setQuote] = useState(getRandomQuote());
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const prefs = loadPreferences();
    setRegion(prefs.region);
    setLanguage(prefs.language);
    setAuthed(Boolean(getAccessToken()));
  }, []);


  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 7000);
    return () => clearInterval(interval);
  }, []);

  const t = (text: string) => translate(language, text);
  const helplines = (() => {
    const regionKey = region || "Universal";
    switch (regionKey) {
      case "US":
        return [
          { label: "Emergency", value: "911" },
          { label: "Mental Health / Crisis", value: "988" },
        ];
      case "UK":
        return [
          { label: "Emergency", value: "999" },
          { label: "Non-emergency", value: "111" },
        ];
      case "EU":
        return [
          { label: "Emergency", value: "112" },
          { label: "Non-emergency", value: "116 117" },
        ];
      case "India":
        return [
          { label: "Emergency", value: "112" },
          { label: "Ambulance", value: "108" },
          { label: "Health Helpline", value: "104" },
        ];
      case "Middle East":
        return [
          { label: "Emergency (common)", value: "112" },
          { label: "Ambulance (varies)", value: "998 / 999" },
        ];
      case "SE Asia":
        return [
          { label: "Emergency (common)", value: "112 / 911" },
          { label: "Ambulance (varies)", value: "119 / 995 / 1669" },
        ];
      default:
        return [
          { label: "Emergency (global)", value: "112" },
          { label: "Local emergency", value: "Use your country code" },
        ];
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">HemoScan AI</h1>
            </div>
          </div>
          <div />
        </div>
        <div className="absolute right-4 top-4">
          <GlobalControls />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo and Tagline */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-red-500 rounded-2xl mb-6 shadow-lg">
              <Droplet className="w-12 h-12 text-white" fill="white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              HemoScan AI
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Smart Anemia Detection • Prevention • Care 🩸
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm">
              <span className="text-blue-600">✨</span>
              <span>{quote}</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 my-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">🩺 Non-Invasive Screening</h3>
              <p className="text-sm text-gray-600">Quick anemia risk assessment using AI technology</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">💚 Health Monitoring</h3>
              <p className="text-sm text-gray-600">Track your hemoglobin levels and overall health</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">🛡️ Prevention & Care</h3>
              <p className="text-sm text-gray-600">Personalized diet plans and health guidance</p>
            </div>
          </div>

          {/* Generative AI Features */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🤖 {t("Generative AI Features")}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">🥗 Generate personalized diet plans</h4>
                <p className="text-sm text-gray-600">Tailored meal plans based on your profile and results.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">💬 AI chatbot explaining reports</h4>
                <p className="text-sm text-gray-600">Ask questions and get simple, friendly explanations.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">🧾 Auto-generate medical summaries</h4>
                <p className="text-sm text-gray-600">Share clean summaries with doctors or family.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">🌍 Translate health advice</h4>
                <p className="text-sm text-gray-600">Localized guidance in your preferred language.</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            {!authed && (
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => navigate("/onboarding")}
              >
                {t("Create Account")}
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8"
              onClick={() => navigate("/assessment")}
            >
              {t("Check Anemia Risk")}
            </Button>
          </div>

          {/* Medical Illustration */}
          <div className="mt-16 relative">
            <div className="w-full h-64 bg-gradient-to-br from-blue-100/50 to-red-100/50 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1642697552227-ca21f326fe41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMGJsb29kJTIwY2VsbHN8ZW58MXx8fHwxNzcwMzA3NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Medical background"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=900&q=80"
                alt="Healthy food"
                className="h-40 w-full object-cover"
              />
              <div className="p-4 text-sm text-gray-700">🥦 Food that supports blood health</div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=900&q=80"
                alt="Doctor consultation"
                className="h-40 w-full object-cover"
              />
              <div className="p-4 text-sm text-gray-700">🧑‍⚕️ Talk to a clinician when needed</div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=900&q=80"
                alt="Healthy lifestyle"
                className="h-40 w-full object-cover"
              />
              <div className="p-4 text-sm text-gray-700">🏃 Consistent habits, better outcomes</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">100K+</p>
              <p className="text-sm text-gray-600">Users Screened</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">95%</p>
              <p className="text-sm text-gray-600">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600">50+</p>
              <p className="text-sm text-gray-600">Partner NGOs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">WHO</p>
              <p className="text-sm text-gray-600">Aligned Guidelines</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p>Empowering communities through accessible anemia detection and prevention</p>
          <div className="mt-4">
            <Button variant="link" className="text-blue-600" onClick={() => navigate("/awareness")}>
              Learn More About Anemia 📘
            </Button>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/70 p-4 text-sm text-gray-700">
          <p className="font-semibold text-red-700 mb-2">🚑 Helplines ({region || "Universal"})</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {helplines.map((item) => (
              <span
                key={`${item.label}-${item.value}`}
                className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs"
              >
                {item.label}: {item.value}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-red-700">
            If you or someone else is in immediate danger, call your local emergency number.
          </p>
        </div>
      </footer>
    </div>
  );
}

