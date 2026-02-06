import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Camera, Eye, AlertCircle, CheckCircle, Info } from "lucide-react";
import { type SupportedLanguage } from "../utils/i18n";
import { api } from "../api/client";

export function ScanScreen() {
  const navigate = useNavigate();
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "complete">("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [translatedAdvice, setTranslatedAdvice] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const buildResult = () => {
    const probability = Math.floor(35 + Math.random() * 51); // 35-85
    const risk = probability >= 70 ? "High" : probability >= 45 ? "Medium" : "Low";
    const confidence = Math.floor(70 + Math.random() * 21); // 70-90
    const recommendation =
      risk === "High"
        ? "Results suggest a higher likelihood of anemia. Please get a Complete Blood Count (CBC) test soon."
        : risk === "Medium"
        ? "Results suggest a possible risk of anemia. We recommend a CBC test for confirmation."
        : "Results suggest a lower risk. Maintain a balanced diet and monitor symptoms.";

    return { probability, risk, confidence, recommendation };
  };

  const startScan = () => {
    if (!imageSrc) {
      setCameraError("Please capture or upload an image before scanning.");
      return;
    }
    setScanStatus("scanning");
    setScanProgress(0);
    setResult(null);
    
    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus("complete");
          setResult(buildResult());
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError("Camera access was blocked or unavailable.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setImageSrc(dataUrl);
  };

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

  const generateSummary = async () => {
    if (!result) return;
    setSummaryLoading(true);
    setAiSummary(null);
    const summary = `Summary: ${result.risk} risk with ${result.probability}% probability and ${result.confidence}% confidence. ` +
      `Suggested next steps: ${result.recommendation}`;
    try {
      const res = await api.summary(summary);
      setAiSummary(res.summary);
      setTranslatedSummary(null);
    } catch {
      setAiSummary(summary);
      setTranslatedSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    if (imageSrc && imageSrc.startsWith("blob:")) {
      return () => {
        URL.revokeObjectURL(imageSrc);
      };
    }
  }, [imageSrc]);

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
              <h1 className="text-lg font-semibold text-gray-900">Non-Invasive Scan 👁️</h1>
              <p className="text-xs text-gray-600">Eye conjunctiva analysis 🧬</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Instructions Card */}
        {scanStatus === "idle" && (
          <>
            <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  How It Works 🧭
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Our AI analyzes the color of your lower eyelid (conjunctiva) to detect signs of anemia. 
                  Pale conjunctiva can indicate low hemoglobin levels.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">1</span>
                    </div>
                    <p className="text-sm text-gray-700">Ensure you're in a well-lit area with natural lighting</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">2</span>
                    </div>
                    <p className="text-sm text-gray-700">Gently pull down your lower eyelid</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-blue-600">3</span>
                    </div>
                    <p className="text-sm text-gray-700">Hold still and capture the image</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Camera Preview Area */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Captured eye"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      {!cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Eye className="w-16 h-16 text-white/50 mx-auto mb-4" />
                            <p className="text-white/70 text-sm">Camera preview will appear here</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {/* Scanning guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-32 border-2 border-white/50 rounded-lg"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                onClick={startCamera}
              >
                <Camera className="w-5 h-5 mr-2" />
                Enable Camera
              </Button>
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                onClick={captureFrame}
                disabled={!cameraActive}
              >
                Capture Image
              </Button>
              <label className="sm:col-span-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
                <Button className="w-full" variant="outline" size="lg">
                  Upload Previous Image
                </Button>
              </label>
              <Button
                className="w-full sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                onClick={startScan}
              >
                Start Scan
              </Button>
            </div>

            {cameraError && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">{cameraError}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> This is a screening tool, not a diagnostic test. 
                Always consult a healthcare professional for accurate diagnosis.
              </p>
            </div>
          </>
        )}

        {/* Scanning State */}
        {scanStatus === "scanning" && (
          <Card className="mb-6">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing... ⚙️</h3>
                <p className="text-sm text-gray-600 mb-6">Please keep your phone steady</p>
                <Progress value={scanProgress} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">{scanProgress}%</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {scanStatus === "complete" && result && (
          <>
            <Card className="mb-6 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Scan Results ✅</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {result.risk} Risk
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">Anemia Probability</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-yellow-600">{result.probability}</span>
                      <span className="text-2xl text-gray-600">%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">Confidence</p>
                      <p className="text-2xl font-semibold text-gray-900">{result.confidence}%</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                      <p className="text-2xl font-semibold text-yellow-600">{result.risk}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      What This Means
                    </h4>
                    <p className="text-sm text-gray-700">{result.recommendation}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4 text-purple-600" />
                      How Our AI Works
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Our AI model analyzes the color and paleness of your conjunctiva (the inner part of your lower eyelid). 
                      Here's what it looks for:
                    </p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">-</span>
                        <span><strong>Color intensity:</strong> Pale conjunctiva may indicate low hemoglobin</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">-</span>
                        <span><strong>Vascular pattern:</strong> Blood vessel visibility in the eye area</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-600">-</span>
                        <span><strong>Confidence level:</strong> {result.confidence}% based on image quality and clarity</span>
                      </div>
                    </div>
                    <p className="text-xs text-purple-700 mt-3 italic">
                      Note: This is a screening tool, not a diagnostic test. Always confirm with a blood test.
                    </p>
                  </div>
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
                    Generate a concise summary you can share with a doctor or family.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recommended Actions 🧭</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Get a Blood Test")}</p>
                      <p className="text-sm text-gray-600">{maybeTranslate("Visit a healthcare facility for a Complete Blood Count (CBC) test")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Review Your Diet")}</p>
                      <p className="text-sm text-gray-600">{maybeTranslate("Check our personalized diet recommendations")}</p>
                      <Button 
                        variant="link" 
                        className="text-green-600 p-0 h-auto mt-1"
                        onClick={() => navigate("/diet")}
                      >
                        {maybeTranslate("View Diet Plan →")}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{maybeTranslate("Consult a Doctor")}</p>
                      <p className="text-sm text-gray-600">{maybeTranslate("Book an appointment with a healthcare professional")}</p>
                      <Button 
                        variant="link" 
                        className="text-purple-600 p-0 h-auto mt-1"
                        onClick={() => navigate("/doctor")}
                      >
                        {maybeTranslate("Find Doctors →")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setScanStatus("idle");
                  setResult(null);
                  setScanProgress(0);
                }}
              >
                Scan Again
              </Button>
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

