import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Upload, TrendingUp, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Legend } from "recharts";

export function HealthTracking() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  // Mock data for Hb levels over time
  const hbData = [
    { date: "Jan", hb: 9.8, status: "Low" },
    { date: "Feb", hb: 10.2, status: "Low" },
    { date: "Mar", hb: 10.8, status: "Mild" },
    { date: "Apr", hb: 11.2, status: "Mild" },
    { date: "May", hb: 11.5, status: "Mild" },
  ];

  const whoComparison = [
    { label: "Your Hb (latest)", value: 11.5 },
    { label: "WHO adult min (female)", value: 12 },
    { label: "WHO adult min (male)", value: 13 },
  ];

  const prevalenceComparison = [
    { label: "Your risk", user: 35, who: 24 },
    { label: "Regional avg", user: 28, who: 24 },
  ];

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
              <h1 className="text-lg font-semibold text-gray-900">Health Tracking 📈</h1>
              <p className="text-xs text-gray-600">Monitor your hemoglobin levels 🩸</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Current Status */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Hemoglobin Level 🧪</span>
              <Badge className="bg-yellow-100 text-yellow-800">Mild Anemia</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">11.5</span>
              <span className="text-lg text-gray-600">g/dL</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Normal Range</p>
                <p className="text-sm font-semibold text-green-700">12-16 g/dL</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Mild Anemia</p>
                <p className="text-sm font-semibold text-yellow-700">10-11.9 g/dL</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Severe</p>
                <p className="text-sm font-semibold text-red-700">&lt;7 g/dL</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hb Trend Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Hemoglobin Trend (Last 5 Months) 📊
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hbData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[8, 16]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <ReferenceLine y={12} stroke="#10b981" strokeDasharray="3 3" label="Normal Min" />
                  <ReferenceLine y={10} stroke="#eab308" strokeDasharray="3 3" label="Mild" />
                  <ReferenceLine y={7} stroke="#ef4444" strokeDasharray="3 3" label="Severe" />
                  <Line 
                    type="monotone" 
                    dataKey="hb" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Good progress!</span> Your hemoglobin level has increased by 1.7 g/dL over the last 5 months.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upload CBC Report */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Upload CBC Report 📄
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload your Complete Blood Count (CBC) report for automatic data extraction
              </p>
              
              {!showUpload ? (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Report (PDF/Image)
                </Button>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Drop your CBC report here or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">AI-Powered OCR:</span> We'll automatically extract hemoglobin, RBC count, and other values from your report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WHO Comparison */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>WHO Comparison Charts 🌍</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Hemoglobin Thresholds (g/dL)</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={whoComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#6b7280" domain={[8, 14]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Anemia Prevalence (%)</h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prevalenceComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#6b7280" domain={[0, 60]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="user" name="You" fill="#22c55e" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="who" name="WHO reference" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              WHO thresholds are general references and may vary by age and clinical context.
            </p>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports 🗂️</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: "May 1, 2026", hb: "11.5 g/dL", status: "Mild Anemia" },
                { date: "Apr 1, 2026", hb: "11.2 g/dL", status: "Mild Anemia" },
                { date: "Mar 1, 2026", hb: "10.8 g/dL", status: "Mild Anemia" },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{report.date}</p>
                    <p className="text-sm text-gray-600">Hb: {report.hb}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

