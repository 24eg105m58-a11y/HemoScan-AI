import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Download, Users, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("all");
  const [timeframe, setTimeframe] = useState("30days");

  // Mock data for prevalence by region
  const regionalData = [
    { region: "North", mild: 2500, moderate: 1200, severe: 300 },
    { region: "South", mild: 3200, moderate: 1800, severe: 450 },
    { region: "East", mild: 2800, moderate: 1500, severe: 350 },
    { region: "West", mild: 2200, moderate: 1000, severe: 250 },
  ];

  // Age & Gender Distribution
  const ageGenderData = [
    { name: "0-5 years", male: 1200, female: 1300 },
    { name: "6-12 years", male: 1400, female: 1600 },
    { name: "13-18 years", male: 1100, female: 2200 },
    { name: "19-30 years", male: 800, female: 3500 },
    { name: "31-50 years", male: 900, female: 2800 },
    { name: "51+ years", male: 1100, female: 1200 },
  ];

  // Severity Distribution
  const severityData = [
    { name: "Normal", value: 15000, color: "#10b981" },
    { name: "Mild Anemia", value: 10700, color: "#eab308" },
    { name: "Moderate Anemia", value: 5500, color: "#f97316" },
    { name: "Severe Anemia", value: 1350, color: "#ef4444" },
  ];

  // Trend over time
  const trendData = [
    { month: "Aug", cases: 8200 },
    { month: "Sep", cases: 8800 },
    { month: "Oct", cases: 9200 },
    { month: "Nov", cases: 8900 },
    { month: "Dec", cases: 9500 },
    { month: "Jan", cases: 10200 },
  ];

  const totalScreened = regionalData.reduce((sum, r) => sum + r.mild + r.moderate + r.severe, 0) + 15000;
  const totalAnemia = regionalData.reduce((sum, r) => sum + r.mild + r.moderate + r.severe, 0);
  const prevalenceRate = ((totalAnemia / totalScreened) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Public Health Dashboard 🗺️</h1>
                <p className="text-sm text-blue-100">NGO & WHO Data Analytics 📊</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-white/30">
                Admin Access
              </Badge>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Filters */}
        <Card className="mb-6 border-blue-200">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="1year">Last 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Data anonymized & GDPR compliant</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Total Screened 👥
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalScreened.toLocaleString()}</div>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Anemia Cases 🩸
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalAnemia.toLocaleString()}</div>
              <p className="text-sm text-yellow-600 mt-1">Needs intervention</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Prevalence Rate ⚠️
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{prevalenceRate}%</div>
              <p className="text-sm text-red-600 mt-1">Above WHO threshold</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Severe Cases 🚨
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">1,350</div>
              <p className="text-sm text-purple-600 mt-1">Priority follow-up</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Regional Prevalence */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Prevalence by Severity 🧭</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="mild" stackId="a" fill="#eab308" name="Mild" />
                    <Bar dataKey="moderate" stackId="a" fill="#f97316" name="Moderate" />
                    <Bar dataKey="severe" stackId="a" fill="#ef4444" name="Severe" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Severity Distribution 📌</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Age & Gender Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Age & Gender Distribution 👨‍👩‍👧‍👦</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageGenderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="male" fill="#3b82f6" name="Male" />
                  <Bar dataKey="female" fill="#ec4899" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Over Time */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Anemia Cases Trend (Last 6 Months) 📈</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Consent */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-base">Privacy & Data Protection 🔒</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">All data is anonymized and aggregated</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">GDPR & WHO data protection guidelines compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">User consent obtained for all data collection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">No personally identifiable information (PII) stored</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

