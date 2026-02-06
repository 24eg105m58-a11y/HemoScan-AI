import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, Search, MapPin, Star, Calendar, MessageSquare, Video, Upload } from "lucide-react";

export function DoctorConsult() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("");

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Hematologist",
      rating: 4.8,
      reviews: 156,
      experience: "15 years",
      location: "City Hospital, Downtown",
      available: "Today 2:00 PM",
      avatar: "SJ",
      consultationFee: "$80",
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Internal Medicine",
      rating: 4.9,
      reviews: 203,
      experience: "12 years",
      location: "Medical Center, Midtown",
      available: "Tomorrow 10:00 AM",
      avatar: "MC",
      consultationFee: "$60",
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      specialty: "Hematologist",
      rating: 4.7,
      reviews: 128,
      experience: "10 years",
      location: "Health Clinic, Uptown",
      available: "Feb 7, 3:00 PM",
      avatar: "PS",
      consultationFee: "$75",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "General Physician",
      rating: 4.6,
      reviews: 95,
      experience: "8 years",
      location: "Community Hospital",
      available: "Today 4:00 PM",
      avatar: "JW",
      consultationFee: "$50",
    },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty;
    return matchesSearch && matchesSpecialty;
  });

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
              <h1 className="text-lg font-semibold text-gray-900">Doctor Consultation 🧑‍⚕️</h1>
              <p className="text-xs text-gray-600">Find and book appointments 📅</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Search and Filters */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-base">Find a Doctor 🔎</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or specialty..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Select value={specialty} onValueChange={setSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="Hematologist">Hematologist</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="General Physician">General Physician</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Location"
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Upload Reports */}
        <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Upload Reports Before Consultation 🗂️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Share your CBC reports and medical history with your doctor before the appointment
            </p>
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Medical Reports
            </Button>
          </CardContent>
        </Card>

        {/* Doctors List */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">
            Available Doctors ({filteredDoctors.length}) ✅
          </h3>
          
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Doctor Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">{doctor.avatar}</span>
                    </div>
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <p className="text-lg font-semibold text-blue-600">{doctor.consultationFee}</p>
                        <p className="text-xs text-gray-500">per consultation</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {doctor.rating} ({doctor.reviews} reviews)
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {doctor.experience} experience
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">Available: {doctor.available}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader>
            <CardTitle className="text-base text-red-900">Emergency Medical Help 🚑</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 mb-4">
              If you're experiencing severe symptoms like extreme fatigue, chest pain, or difficulty breathing, 
              please seek immediate medical attention.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1">
                Call Emergency: 911
              </Button>
              <Button variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50">
                <a href="https://www.google.com/maps/search/nearest+er+to+my+location/@17.4255585,78.6505007,14z/data=!3m1!4b1?entry=ttu&g_ep=EgoyMDI2MDIwMy4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D">Find Nearest ER</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

