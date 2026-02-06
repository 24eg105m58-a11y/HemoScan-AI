import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, Eye, FileText, Stethoscope } from "lucide-react";

export function AssessmentChoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Choose Assessment Type</h1>
            <p className="text-sm text-gray-600 mt-1">Select how you want to check anemia risk</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 md:py-12 max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Eye Conjunctiva Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Use your camera or upload an eye image for a non-invasive screening.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate("/scan")}>
                Start Eye Scan
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                CBC Report Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Upload your CBC report to get a detailed analysis.
              </p>
              <Button variant="outline" onClick={() => navigate("/cbc-analysis")}>
                Upload CBC
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Symptoms Checker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Answer questions about symptoms to estimate risk.
              </p>
              <Button variant="outline" onClick={() => navigate("/symptoms")}>
                Start Symptoms Check
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-red-600" />
                Doctor Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Book a consultation if you already have symptoms or concerns.
              </p>
              <Button variant="outline" onClick={() => navigate("/doctor")}>
                Find Doctor
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
