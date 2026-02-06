import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Droplet, Mail, Lock, ShieldCheck } from "lucide-react";
import { api } from "../api/client";
import { setTokens, setUserEmail } from "../auth/store";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      setTokens(res.token, res.refresh_token);
      setUserEmail(res.user.email);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl ai-float-slow"></div>
      <div className="pointer-events-none absolute top-20 -right-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl ai-float"></div>
      <div className="pointer-events-none absolute bottom-10 left-1/4 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl ai-float-fast"></div>

      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          <div className="space-y-6 ai-fade-up">
            <div className="inline-flex items-center gap-2 text-blue-700 bg-blue-100/60 px-3 py-1.5 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Generative AI Health Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Personalized anemia insights powered by AI
            </h1>
            <p className="text-lg text-gray-600">
              Use HemoScan AI to analyze CBC reports, scan conjunctiva images, and
              get clear, multilingual explanations with personalized diet guidance.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm">
              <span className="text-sky-600">•</span>
              <span>Healthy blood starts with consistent care and smart choices.</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-sky-100 bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-900">Smart reports</p>
                <p className="text-sm text-gray-600">Auto-summarize and simplify CBC results.</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-900">AI guidance</p>
                <p className="text-sm text-gray-600">Diet plans tailored to your profile.</p>
              </div>
            </div>
          </div>

          <Card className="p-6 md:p-8 shadow-xl rounded-2xl ai-fade-up ai-pulse-glow bg-white/95 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-lg flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sign in to continue</h1>
                <p className="text-sm text-gray-600">Use your clinical or personal account credentials.</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hemoscan.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter at least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-sky-600 hover:underline"
                  onClick={() => navigate("/password-reset")}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                Sign In
              </Button>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex-1 h-px bg-slate-200"></span>
                OR
                <span className="flex-1 h-px bg-slate-200"></span>
              </div>

              <Button type="button" variant="outline" className="w-full" asChild>
                <a href={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/google/login`}>
                  Continue with Google
                </a>
              </Button>

              <div className="text-center text-sm text-slate-600">
                <button
                  type="button"
                  className="text-sky-600 hover:underline"
                  onClick={() => navigate("/onboarding")}
                >
                  Create account
                </button>
                <span className="mx-2 text-slate-400">•</span>
                <button
                  type="button"
                  className="text-sky-600 hover:underline"
                  onClick={() => navigate("/admin")}
                >
                  Admin login
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-sky-600 hover:underline"
                  onClick={() => navigate("/")}
                >
                  Back to landing page
                </button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
