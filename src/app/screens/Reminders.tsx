import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ArrowLeft, Bell, Calendar, Pill, TestTube2, Stethoscope, Plus } from "lucide-react";
import { toast } from "sonner";

export function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      type: "medication",
      title: "Iron Tablet",
      time: "8:00 PM",
      days: "Daily",
      enabled: true,
      icon: Pill,
      color: "blue",
    },
    {
      id: 2,
      type: "test",
      title: "Hemoglobin Test",
      time: "Feb 15, 2026",
      days: "One-time",
      enabled: true,
      icon: TestTube2,
      color: "red",
    },
    {
      id: 3,
      type: "appointment",
      title: "Doctor Visit",
      time: "Feb 20, 2026 10:00 AM",
      days: "One-time",
      enabled: true,
      icon: Stethoscope,
      color: "purple",
    },
    {
      id: 4,
      type: "medication",
      title: "Folic Acid",
      time: "9:00 AM",
      days: "Daily",
      enabled: false,
      icon: Pill,
      color: "green",
    },
  ]);

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast.success(reminder.enabled ? "Reminder disabled" : "Reminder enabled");
    }
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      red: "bg-red-100 text-red-600 border-red-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      green: "bg-green-100 text-green-600 border-green-200",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Medical Reminders ⏰</h1>
                <p className="text-xs text-gray-600">Manage your health schedule ✅</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="reminder-title">Reminder Title</Label>
                    <Input id="reminder-title" placeholder="e.g., Iron Tablet" />
                  </div>
                  <div>
                    <Label htmlFor="reminder-time">Time</Label>
                    <Input id="reminder-time" type="time" />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Info Card */}
        <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Stay on Track 🎯
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Never miss your medication or health check-ups. Set reminders and get notifications 
              to maintain your health routine.
            </p>
          </CardContent>
        </Card>

        {/* Reminders List */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">Active Reminders 🔔</h3>
          {reminders.filter(r => r.enabled).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No active reminders</p>
              </CardContent>
            </Card>
          ) : (
            reminders.filter(r => r.enabled).map((reminder) => (
              <Card key={reminder.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(reminder.color)}`}>
                      <reminder.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">{reminder.time}</p>
                        </div>
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reminder.days}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Inactive Reminders */}
        {reminders.filter(r => !r.enabled).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Inactive Reminders 💤</h3>
            {reminders.filter(r => !r.enabled).map((reminder) => (
              <Card key={reminder.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClass(reminder.color)}`}>
                      <reminder.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">{reminder.time}</p>
                        </div>
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {reminder.days}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Calendar Integration Info */}
        <Card className="mt-6 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Calendar Integration 📅
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Sync your reminders with your phone's calendar for better organization
            </p>
            <Button variant="outline" className="w-full">
              Connect Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">💡 Reminder Tips</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Take iron tablets with vitamin C for better absorption</li>
            <li>• Schedule blood tests at least 3 months apart</li>
            <li>• Set medication reminders for the same time daily</li>
            <li>• Don't skip doctor appointments even if you feel better</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

