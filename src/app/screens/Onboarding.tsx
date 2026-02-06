import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Progress } from "../components/ui/progress";
import { Droplet, ArrowLeft, ArrowRight } from "lucide-react";
import { translate, type SupportedLanguage } from "../utils/i18n";
import { api } from "../api/client";
import { setTokens, setUserEmail } from "../auth/store";
import { toast } from "sonner";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [region, setRegion] = useState("US");
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [skipMetrics, setSkipMetrics] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    gender: "",
    height: "",
    weight: "",
    dietType: "",
    isPregnant: "",
    menstrualCycle: "",
    chronicDiseases: "",
    chronicDetails: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("userPreferences");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.region) setRegion(parsed.region);
      if (parsed.language) setLanguage(parsed.language);
    } catch {
      // ignore invalid preferences
    }
  }, []);

  const unitSystem = useMemo(() => {
    return region === "US" || region === "UK" ? "imperial" : "metric";
  }, [region]);

  const t = (text: string) => translate(language, text);
  const heightLabel = unitSystem === "imperial" ? "Height (in)" : "Height (cm)";
  const weightLabel = unitSystem === "imperial" ? "Weight (lb)" : "Weight (kg)";
  const heightValue = parseFloat(formData.height || "0");
  const weightValue = parseFloat(formData.weight || "0");
  const heightCm = unitSystem === "imperial" ? heightValue * 2.54 : heightValue;
  const weightKg = unitSystem === "imperial" ? weightValue * 0.453592 : weightValue;
  const bmi =
    heightCm > 0 && weightKg > 0
      ? (weightKg / ((heightCm / 100) ** 2)).toFixed(1)
      : null;

  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    setError(null);
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.age || !formData.gender || !formData.email) {
        setError("Please enter name, email, age, and select gender to continue.");
        return;
      }
    }
    if (step === 2) {
      if (!skipMetrics && (!formData.height || !formData.weight)) {
        setError("Please enter height and weight to continue.");
        return;
      }
    }
    if (step === 3) {
      if (!formData.dietType) {
        setError("Please select a diet type to continue.");
        return;
      }
      if (formData.gender === "female") {
        if (!formData.menstrualCycle || !formData.isPregnant) {
          setError("Please complete menstrual cycle and pregnancy details to continue.");
          return;
        }
      }
    }
    if (step === 4) {
      if (!formData.chronicDiseases) {
        setError("Please answer the chronic diseases question to continue.");
        return;
      }
      if (formData.chronicDiseases === "yes" && !formData.chronicDetails.trim()) {
        setError("Please provide details about chronic diseases to continue.");
        return;
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const heightValue = parseFloat(formData.height || "0");
      const weightValue = parseFloat(formData.weight || "0");
      const heightCm = skipMetrics ? 0 : unitSystem === "imperial" ? heightValue * 2.54 : heightValue;
      const weightKg = skipMetrics ? 0 : unitSystem === "imperial" ? weightValue * 0.453592 : weightValue;
      // Save to localStorage (normalized)
      const profile = {
        ...formData,
        height: heightCm ? heightCm.toFixed(1) : "",
        weight: weightKg ? weightKg.toFixed(1) : "",
        skippedMetrics: skipMetrics,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        unitSystem,
        region,
        language,
      };
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setUserEmail(formData.email);
      if (!localStorage.getItem("authToken")) {
        // auto-register demo user if not logged in
        try {
          await api.register(formData.email, "DemoPass123");
        } catch {
          // ignore if already exists
        }
        try {
          const res = await api.login(formData.email, "DemoPass123");
          setTokens(res.token, res.refresh_token);
        } catch {
          toast.error("Account already exists. Please sign in.");
          navigate("/login");
          return;
        }
      }
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-lg flex items-center justify-center">
            <Droplet className="w-6 h-6 text-white" fill="white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">HemoScan AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 md:py-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {t("Step")} {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("Basic Information")}</h2>
                <p className="text-gray-600">Help us personalize your health journey</p>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Metrics */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("Physical Metrics")}</h2>
                <p className="text-gray-600">Help us understand your body composition</p>
              </div>

              <div className="space-y-5">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600"
                    checked={skipMetrics}
                    onChange={(e) => setSkipMetrics(e.target.checked)}
                  />
                  I don’t know my height/weight right now (skip this step)
                </label>

                <div className="space-y-2">
                  <Label htmlFor="height">{heightLabel}</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    disabled={skipMetrics}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">{weightLabel}</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    disabled={skipMetrics}
                  />
                </div>

                {bmi && !skipMetrics && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      BMI: <span className="font-semibold">{bmi}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Diet & Lifestyle */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("Diet & Lifestyle")}</h2>
                <p className="text-gray-600">Your dietary preferences matter for recommendations</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <RadioGroup value={formData.dietType} onValueChange={(value) => setFormData({ ...formData, dietType: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="veg" id="veg" />
                      <Label htmlFor="veg">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nonveg" id="nonveg" />
                      <Label htmlFor="nonveg">Non-Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.gender === "female" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="menstrual-cycle">Menstrual cycle length (days)</Label>
                      <Input
                        id="menstrual-cycle"
                        type="number"
                        placeholder="e.g., 28"
                        value={formData.menstrualCycle}
                        onChange={(e) => setFormData({ ...formData, menstrualCycle: e.target.value })}
                      />
                    </div>
                    <Label>Are you currently pregnant?</Label>
                    <RadioGroup value={formData.isPregnant} onValueChange={(value) => setFormData({ ...formData, isPregnant: value })}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pregnant-yes" />
                        <Label htmlFor="pregnant-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pregnant-no" />
                        <Label htmlFor="pregnant-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Health Conditions */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("Health Conditions")}</h2>
                <p className="text-gray-600">This helps us provide better recommendations</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Do you have any chronic diseases?</Label>
                  <RadioGroup value={formData.chronicDiseases} onValueChange={(value) => setFormData({ ...formData, chronicDiseases: value })}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="chronic-no" />
                      <Label htmlFor="chronic-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="chronic-yes" />
                      <Label htmlFor="chronic-yes">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.chronicDiseases === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="chronic-details">Please specify</Label>
                    <Input
                      id="chronic-details"
                      type="text"
                      placeholder="e.g., diabetes, thyroid issues, kidney disease"
                      value={formData.chronicDetails}
                      onChange={(e) => setFormData({ ...formData, chronicDetails: e.target.value })}
                    />
                  </div>
                )}


                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    🔒 Your health information is private and secure. We follow WHO guidelines for data protection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {error && (
            <div className="mt-6 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("Back")}
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {step === totalSteps ? t("Get Started") : t("Next")}
              {step !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

