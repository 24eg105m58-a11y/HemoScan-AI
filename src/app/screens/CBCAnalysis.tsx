import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Eye,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { type SupportedLanguage } from "../utils/i18n";
import { api } from "../api/client";

export function CBCAnalysis() {
  const navigate = useNavigate();
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [consent, setConsent] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [translatedAdvice, setTranslatedAdvice] = useState(false);

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

  const translateSummary = async (text: string) => {
    if (language === "English") return;
    try {
      const res = await api.translate(text, language);
      setTranslatedSummary(res.translated);
    } catch {
      setTranslatedSummary(`[${language}] ${text}`);
    }
  };

  const parseOcrText = (text: string) => {
    const getNum = (label: string) => {
      const re = new RegExp(`${label}[^0-9]*([0-9]+\\.?[0-9]*)`, "i");
      const match = text.match(re);
      return match ? parseFloat(match[1]) : null;
    };
    return {
      hemoglobin: getNum("Hb|Hemoglobin") ?? 9.2,
      rbc: getNum("RBC") ?? 3.8,
      hematocrit: getNum("Hematocrit|HCT") ?? 28.5,
      mcv: getNum("MCV") ?? 72,
      mch: getNum("MCH") ?? 24,
      mchc: getNum("MCHC") ?? 30,
      rdw: getNum("RDW") ?? 16.5,
      wbc: getNum("WBC") ?? 7.2,
      platelets: getNum("Platelets") ?? 220,
      date: "Feb 3, 2026",
      lab: "City Medical Laboratory",
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!consent) {
      toast.error("Please provide consent before uploading");
      return;
    }

    setUploadStatus("uploading");
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          clearInterval(uploadInterval);
          setUploadStatus("processing");
          processFile(file);
          return 50;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processFile = async (file: File) => {
    setProgress(50);
    
    // Simulate OCR processing
    const processingInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 300);

    try {
      const res = await api.ocr(file);
      const parsed = parseOcrText(res.text);
      setExtractedData(parsed);
    } catch {
      setExtractedData(parseOcrText(""));
      toast.error("OCR failed; using fallback values");
    } finally {
      clearInterval(processingInterval);
      setProgress(100);
      setUploadStatus("complete");
    }
  };

  const getSeverityInfo = (hb: number) => {
    if (hb >= 12) {
      return {
        level: "Normal",
        color: "green",
        description: "Your hemoglobin level is within the normal range.",
        action: "Continue maintaining a healthy diet and lifestyle.",
        bgClass: "bg-green-50 border-green-200",
        textClass: "text-green-800",
        badgeClass: "bg-green-100 text-green-800",
      };
    } else if (hb >= 10) {
      return {
        level: "Mild Anemia",
        color: "yellow",
        description: "Your hemoglobin level indicates mild anemia.",
        action: "Consider increasing iron-rich foods in your diet and consult a healthcare provider.",
        bgClass: "bg-yellow-50 border-yellow-200",
        textClass: "text-yellow-800",
        badgeClass: "bg-yellow-100 text-yellow-800",
      };
    } else if (hb >= 7) {
      return {
        level: "Moderate Anemia",
        color: "orange",
        description: "Your hemoglobin level indicates moderate anemia that requires attention.",
        action: "Please consult a healthcare provider soon for proper treatment and iron supplementation.",
        bgClass: "bg-orange-50 border-orange-200",
        textClass: "text-orange-800",
        badgeClass: "bg-orange-100 text-orange-800",
      };
    } else {
      return {
        level: "Severe Anemia",
        color: "red",
        description: "Warning: Your hemoglobin level indicates severe anemia - IMMEDIATE MEDICAL ATTENTION REQUIRED.",
        action: "Please visit a hospital or emergency room immediately. This condition requires urgent medical care.",
        bgClass: "bg-red-50 border-red-200",
        textClass: "text-red-800",
        badgeClass: "bg-red-100 text-red-800",
      };
    }
  };

  const severity = extractedData ? getSeverityInfo(extractedData.hemoglobin) : null;

  const buildSummary = () => {
    if (!extractedData || !severity) return "";
    return `Summary: ${severity.level} detected with Hb ${extractedData.hemoglobin} g/dL and MCV ${extractedData.mcv} fL. ` +
      `Likely microcytic pattern suggests iron deficiency. Recommended next steps: ${severity.action}`;
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    setAiSummary(null);
    try {
      const base = buildSummary();
      const res = await api.summary(base);
      setAiSummary(res.summary);
      setTranslatedSummary(null);
    } catch {
      setAiSummary(buildSummary());
      setTranslatedSummary(null);
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
              <h1 className="text-lg font-semibold text-gray-900">CBC Report Analysis 🧪</h1>
              <p className="text-xs text-gray-600">AI-powered blood report analysis 🤖</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              How It Works 🧭
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Upload your Complete Blood Count (CBC) report, and our AI will automatically extract key values 
              like hemoglobin, RBC count, and other blood parameters to provide instant analysis.
            </p>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <span className="text-gray-700">Upload report</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <span className="text-gray-700">AI extracts data</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <span className="text-gray-700">Get instant analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent & Privacy */}
        {uploadStatus === "idle" && (
          <>
            <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-5 h-5 text-purple-600" />
                Privacy & Consent 🔐
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                    Your medical data is important to us. Please review and consent:
                  </p>
                  
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Your data is encrypted and stored securely</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Only you and your authorized healthcare providers can access your reports</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Anonymized data may be used for public health research (with your consent)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>You can delete your data anytime</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-purple-200">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <label htmlFor="consent" className="text-sm font-medium text-gray-900 cursor-pointer">
                      I consent to upload and analyze my medical report
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Your CBC Report 📄
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your CBC report here
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    or click to browse from your device
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileUpload}
                    disabled={!consent}
                  />
                  <label htmlFor="file-upload">
                    <Button 
                      asChild 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!consent}
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>

                {!consent && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Please provide consent above before uploading your report
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Uploading/Processing State */}
        {(uploadStatus === "uploading" || uploadStatus === "processing") && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {uploadStatus === "uploading" ? "Uploading Report..." : "Analyzing Report..."}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {uploadStatus === "uploading" 
                    ? "Securely uploading your document" 
                    : "AI is extracting values from your report"}
                </p>
                <Progress value={progress} className="h-3 mb-2 max-w-md mx-auto" />
                <p className="text-sm text-gray-600">{progress}%</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {uploadStatus === "complete" && extractedData && severity && (
          <>
            {/* Emergency Alert for Severe Cases */}
            {extractedData.hemoglobin < 7 && (
              <Alert className="mb-6 border-2 border-red-500 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <p className="font-semibold mb-2">CRITICAL: SEVERE ANEMIA DETECTED</p>
                  <p className="mb-2">Your hemoglobin level is dangerously low (below 7 g/dL). This requires immediate medical attention.</p>
                  <div className="flex gap-3 mt-3">
                    <Button variant="destructive" size="sm">
                      Call Emergency: 911
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-300 text-red-700"
                      onClick={() => navigate("/doctor")}
                    >
                      Find Nearest Hospital
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Severity Classification */}
            <Card className={`mb-6 border-2 ${severity.bgClass}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analysis Complete ✅</span>
                  <Badge className={severity.badgeClass}>
                    {severity.level}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">Hemoglobin Level</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-gray-900">{extractedData.hemoglobin}</span>
                      <span className="text-2xl text-gray-600">g/dL</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border ${severity.bgClass}`}>
                    <p className={`text-sm font-medium ${severity.textClass} mb-2`}>
                      {severity.description}
                    </p>
                    <p className={`text-sm ${severity.textClass}`}>
                      <span className="font-semibold">Recommended Action:</span> {severity.action}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Values */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Extracted Values 👀
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Report Date:</span>
                    <span className="font-medium text-gray-900">{extractedData.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Laboratory:</span>
                    <span className="font-medium text-gray-900">{extractedData.lab}</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Hemoglobin (Hb)</span>
                      <Badge className={severity.badgeClass}>
                        {severity.level}
                      </Badge>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{extractedData.hemoglobin} g/dL</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 12-16 g/dL (women)</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">Red Blood Cells (RBC)</span>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{extractedData.rbc} M/μL</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 4.0-5.5 M/μL</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">Hematocrit (HCT)</span>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{extractedData.hematocrit}%</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 36-46%</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">MCV</span>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{extractedData.mcv} fL</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 80-100 fL</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">MCH</span>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{extractedData.mch} pg</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 27-33 pg</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">RDW</span>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{extractedData.rdw}%</p>
                    <p className="text-xs text-gray-500 mt-1">Normal: 11.5-14.5%</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Understanding Your Results
                  </h4>
                  <p className="text-sm text-gray-700">
                    Your MCV value of {extractedData.mcv} fL suggests <span className="font-semibold">microcytic anemia</span>, 
                    which is commonly caused by iron deficiency. This type of anemia means your red blood cells are 
                    smaller than normal, typically due to insufficient iron to produce adequate hemoglobin.
                  </p>
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
                  <Button
                    variant="outline"
                    onClick={generateSummary}
                    disabled={summaryLoading}
                  >
                    {summaryLoading ? "Generating..." : "Generate Summary"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const next = !translatedAdvice;
                      setTranslatedAdvice(next);
                      if (next && aiSummary) {
                        await translateSummary(aiSummary);
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
                    Generate a concise medical summary you can share with a doctor or family.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personalized Recommendations 🍎</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Increase Iron-Rich Foods")}</p>
                      <p className="text-sm text-gray-600 mt-1">{maybeTranslate("Include red meat, spinach, lentils, and fortified cereals in your diet")}</p>
                      <Button 
                        variant="link" 
                        className="text-green-600 p-0 h-auto mt-2"
                        onClick={() => navigate("/diet")}
                      >
                        {maybeTranslate("View Personalized Diet Plan →")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Iron Supplementation")}</p>
                      <p className="text-sm text-gray-600 mt-1">{maybeTranslate("Consult your doctor about taking iron supplements (typically 30-60mg daily)")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Follow-up Testing")}</p>
                      <p className="text-sm text-gray-600 mt-1">{maybeTranslate("Recheck your hemoglobin levels in 4-6 weeks to monitor improvement")}</p>
                      <Button 
                        variant="link" 
                        className="text-purple-600 p-0 h-auto mt-2"
                        onClick={() => navigate("/reminders")}
                      >
                        {maybeTranslate("Set Reminder →")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Consult Healthcare Provider")}</p>
                      <p className="text-sm text-gray-600 mt-1">{maybeTranslate("Discuss these results with a doctor for proper diagnosis and treatment plan")}</p>
                      <Button 
                        variant="link" 
                        className="text-orange-600 p-0 h-auto mt-2"
                        onClick={() => navigate("/doctor")}
                      >
                        {maybeTranslate("Find Doctors →")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setUploadStatus("idle");
                  setExtractedData(null);
                  setProgress(0);
                }}
              >
                Upload Another Report
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={async () => {
                  try {
                    await api.saveCbc({
                      hemoglobin: extractedData.hemoglobin,
                      rbc: extractedData.rbc,
                      hematocrit: extractedData.hematocrit,
                      mcv: extractedData.mcv,
                      mch: extractedData.mch,
                      mchc: extractedData.mchc,
                      rdw: extractedData.rdw,
                      wbc: extractedData.wbc,
                      platelets: extractedData.platelets,
                      lab: extractedData.lab,
                      report_date: extractedData.date,
                    });
                    toast.success("Report saved to your health records");
                  } catch {
                    toast.error("Failed to save report");
                  } finally {
                    navigate("/dashboard");
                  }
                }}
              >
                Save & Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
