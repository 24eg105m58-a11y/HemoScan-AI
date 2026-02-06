import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { api } from "../api/client";
import { clearTokens, getRefreshToken } from "../auth/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { 
  Droplet, 
  Activity, 
  FileText, 
  Camera, 
  Apple, 
  Calendar,
  Bell,
  TrendingUp,
  AlertCircle,
  Menu,
  User,
  LogOut
} from "lucide-react";
import { getRandomQuote } from "../utils/quotes";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Dashboard() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(getRandomQuote());

  // Mock user data
  const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const storedEmail = localStorage.getItem("userEmail") || "";
  const displayName =
    storedProfile.name ||
    storedProfile.fullName ||
    storedProfile.email ||
    "User";

  const userData = {
    name: displayName,
    hbLevel: 11.2,
    hbStatus: "Mild Anemia",
    hbStatusColor: "yellow",
    riskScore: "Medium",
    nextReminder: "Iron Tablet - Today 8 PM",
  };

  const ngoReportData = [
    { label: "Screened", value: 1240 },
    { label: "Mild", value: 420 },
    { label: "Moderate", value: 180 },
    { label: "Severe", value: 45 },
  ];

  useEffect(() => {
    const interval = setInterval(() => setQuote(getRandomQuote()), 7000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "Mild Anemia":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Moderate Anemia":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Severe Anemia":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">HemoScan AI 🩸</h1>
                <p className="text-xs text-gray-600">Dashboard 📊</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/awareness")}>
                <Menu className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Profile 👤</DropdownMenuLabel>
                  <div className="px-3 pb-2 text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{userData.name}</div>
                    <div className="text-xs">{storedEmail || "No email on file"}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                    Profile settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await api.logout(getRefreshToken());
                      } finally {
                        clearTokens();
                        navigate("/login");
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {userData.name}! 👋</h2>
          <p className="text-gray-600">Here's your health overview 💡</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm">
            <span className="text-blue-600">•</span>
            <span>{quote}</span>
          </div>
        </div>

        {/* Health Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Hemoglobin Level */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-blue-600" />
                Hemoglobin Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{userData.hbLevel}</span>
                  <span className="text-sm text-gray-600">g/dL</span>
                </div>
                <Badge className={getStatusBadgeClass(userData.hbStatus)}>
                  {userData.hbStatus}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Anemia Risk Score */}
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                Anemia Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">{userData.riskScore}</span>
                </div>
                <Badge className={getRiskBadgeClass(userData.riskScore)}>
                  Risk Level
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Reminder */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-600" />
                Next Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{userData.nextReminder}</p>
                <Button 
                  variant="link" 
                  className="text-green-600 p-0 h-auto"
                  onClick={() => navigate("/reminders")}
                >
                  View All Reminders →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions ⚡</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/cbc-analysis")}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Upload CBC Report</span>
            </button>

            <button
              onClick={() => navigate("/scan")}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Scan Eye</span>
            </button>

            <button
              onClick={() => navigate("/diet")}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Apple className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Diet Plan</span>
            </button>

            <button
              onClick={() => navigate("/doctor")}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Doctor Consult</span>
            </button>
          </div>
        </div>

        {/* Health Trend */}
        <Card className="mb-6">
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Health Trend 📈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last 30 days</p>
                <p className="text-lg font-semibold text-gray-900">Hemoglobin improving</p>
                <p className="text-sm text-green-600">+0.8 g/dL increase</p>
              </div>
              <Button onClick={() => navigate("/tracking")}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* NGO Reports Snapshot */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              NGO Reports Snapshot 🏥
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Community screening results from partner NGOs (last 30 days).
                </p>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ngoReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="rounded-lg border border-purple-200 bg-white p-3">
                  <p className="font-medium">Top focus areas</p>
                  <p className="text-gray-600">Rural screening, maternal health, school outreach.</p>
                </div>
                <div className="rounded-lg border border-purple-200 bg-white p-3">
                  <p className="font-medium">Action needed</p>
                  <p className="text-gray-600">Prioritize follow-up for moderate and severe cases.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/symptoms")}>
            <CardHeader>
              <CardTitle className="text-base">Symptoms Tracker 🧠</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Log your daily symptoms and track patterns</p>
              <Button variant="outline" className="w-full">
                Track Symptoms
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/reminders")}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Medical Reminders ⏰
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">Manage your medication and test schedules</p>
              <Button variant="outline" className="w-full">
                Manage Reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Awareness Banner */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Learn About Anemia</h3>
          <p className="text-sm text-gray-600 mb-4">
            Access WHO-aligned guidelines, prevention tips, and educational resources
          </p>
          <Button variant="outline" onClick={() => navigate("/awareness")}>
            Explore Resources
          </Button>
        </div>
      </main>
    </div>
  );
}

