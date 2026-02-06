import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { ArrowLeft, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";
import { type SupportedLanguage } from "../utils/i18n";
import { api } from "../api/client";

export function SymptomsTracker() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [translatedAdvice, setTranslatedAdvice] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const [symptoms, setSymptoms] = useState({
    tiredness: { checked: false, severity: 1 },
    paleSkin: { checked: false, severity: 1 },
    dizziness: { checked: false, severity: 1 },
    shortnessOfBreath: { checked: false, severity: 1 },
    cravingIce: { checked: false, severity: 1 },
    chestPain: { checked: false, severity: 1 },
    coldHandsFeet: { checked: false, severity: 1 },
    headache: { checked: false, severity: 1 },
  });
  
  const symptomsList = [
    { key: "tiredness", label: "Tiredness / Fatigue" },
    { key: "paleSkin", label: "Pale Skin or Nail Beds" },
    { key: "dizziness", label: "Dizziness or Lightheadedness" },
    { key: "shortnessOfBreath", label: "Shortness of Breath" },
    { key: "cravingIce", label: "Craving Ice or Clay (Pica)" },
    { key: "chestPain", label: "Chest Pain", warning: true },
    { key: "coldHandsFeet", label: "Cold Hands or Feet" },
    { key: "headache", label: "Frequent Headaches" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.language) setLanguage(parsed.language);
    } catch {
      // ignore invalid preferences
    }
  }, []);

  const maybeTranslate = (text: string) => {
    if (language === "English" || !translatedAdvice) return text;
    return `[${language}] ${text}`;
  };

  const handleSymptomToggle = (key: string, checked: boolean) => {
    setSymptoms((prev) => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], checked },
    }));
  };

  const handleSeverityChange = (key: string, value: number[]) => {
    setSymptoms((prev) => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], severity: value[0] },
    }));
  };

  const getSeverityLabel = (value: number) => {
    if (value === 1) return "Mild";
    if (value === 2) return "Moderate";
    return "Severe";
  };

  const getSeverityColor = (value: number) => {
    if (value === 1) return "text-yellow-600";
    if (value === 2) return "text-orange-600";
    return "text-red-600";
  };

  const handleSave = async () => {
    const selectedSymptoms = Object.entries(symptoms).filter(([_, value]) => value.checked);
    localStorage.setItem("symptoms", JSON.stringify(symptoms));
    try {
      await api.saveSymptoms({ symptoms });
      toast.success(`Saved ${selectedSymptoms.length} symptom(s) successfully!`);
    } catch {
      toast.error("Failed to save symptoms");
    }
  };

  const hasChestPain = symptoms.chestPain.checked;
  const selectedCount = Object.values(symptoms).filter((s) => s.checked).length;

  const generateSummary = async () => {
    setSummaryLoading(true);
    setAiSummary(null);
    const level = selectedCount >= 4 ? "higher" : selectedCount >= 2 ? "moderate" : "lower";
    const summary =
      `Summary: You reported ${selectedCount} symptom(s). Risk appears ${level}. ` +
      `Consider tracking daily patterns and consult a clinician if symptoms persist.`;
    try {
      const res = await api.summary(summary);
      setAiSummary(res.summary);
    } catch {
      setAiSummary(summary);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Symptoms Tracker 🧠</h1>
              <p className="text-xs text-gray-600">Monitor your daily symptoms 📅</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Emergency Warning */}
        {hasChestPain && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Seek Immediate Medical Attention</h3>
                <p className="text-sm text-red-800">
                  Chest pain can be a serious symptom. Please consult a healthcare professional immediately 
                  or visit the nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
          <CardTitle>Track Your Symptoms ✅</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Select the symptoms you're experiencing and rate their severity. This helps monitor your 
              health patterns and provides better recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Symptoms List */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle>Common Anemia Symptoms 🩸</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {symptomsList.map((symptom) => (
                <div key={symptom.key} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={symptom.key}
                      checked={symptoms[symptom.key as keyof typeof symptoms].checked}
                      onCheckedChange={(checked) => 
                        handleSymptomToggle(symptom.key, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={symptom.key} 
                      className="flex-1 cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-xs font-semibold text-slate-500">SYM</span>
                      <span className="font-medium text-gray-900">{symptom.label}</span>
                      {symptom.warning && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </Label>
                  </div>
                  
                  {symptoms[symptom.key as keyof typeof symptoms].checked && (
                    <div className="ml-9 pl-4 border-l-2 border-gray-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-gray-600">Severity Level</Label>
                          <span className={`text-sm font-semibold ${getSeverityColor(symptoms[symptom.key as keyof typeof symptoms].severity)}`}>
                            {getSeverityLabel(symptoms[symptom.key as keyof typeof symptoms].severity)}
                          </span>
                        </div>
                        <Slider
                          value={[symptoms[symptom.key as keyof typeof symptoms].severity]}
                          onValueChange={(value) => handleSeverityChange(symptom.key, value)}
                          min={1}
                          max={3}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mild</span>
                          <span>Moderate</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Summary & Translation */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle>Generative AI Summary ✨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant="outline" onClick={generateSummary} disabled={summaryLoading}>
                {summaryLoading ? "Generating..." : "Generate Summary"}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  const next = !translatedAdvice;
                  setTranslatedAdvice(next);
                  if (next && aiSummary && language !== "English") {
                    try {
                      const res = await api.translate(aiSummary, language);
                      setTranslatedSummary(res.translated);
                    } catch {
                      setTranslatedSummary(`[${language}] ${aiSummary}`);
                    }
                  } else {
                    setTranslatedSummary(null);
                  }
                }}
              >
                {translatedAdvice ? "Show Original Advice" : "Translate Advice"}
              </Button>
            </div>
            {aiSummary ? (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
                {translatedAdvice && language !== "English" && translatedSummary
                  ? translatedSummary
                  : aiSummary}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Generate a concise summary of your symptom report.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle>Today's Summary 🗓️</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{maybeTranslate("Symptoms Reported")}</span>
                <span className="text-lg font-semibold text-blue-600">
                  {selectedCount}
                </span>
              </div>
              {selectedCount > 3 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    {maybeTranslate("You're experiencing multiple symptoms. Consider scheduling a doctor consultation.")}
                  </p>
                  <Button 
                    variant="link" 
                    className="text-yellow-700 p-0 h-auto mt-2"
                    onClick={() => navigate("/doctor")}
                  >
                    {maybeTranslate("Find a Doctor ?")}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Symptoms
          </Button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            Tip: Track your symptoms daily to identify patterns and monitor improvement over time.
          </p>
        </div>
      </main>
    </div>
  );
}
