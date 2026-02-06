import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { api } from "../api/client";
import { toast } from "sonner";

export function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tokenIssued, setTokenIssued] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestReset = async () => {
    if (!email) {
      toast.error("Enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.passwordReset(email);
      if (res.reset_token) {
        setTokenIssued(res.reset_token);
        setToken(res.reset_token);
      }
      toast.success("If your email exists, a reset link was created.");
    } catch {
      toast.error("Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async () => {
    if (!token || !newPassword) {
      toast.error("Enter the reset token and new password.");
      return;
    }
    setLoading(true);
    try {
      await api.passwordResetConfirm(token, newPassword);
      toast.success("Password updated. Please sign in.");
      navigate("/login");
    } catch {
      toast.error("Reset failed. Check the token and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email to receive a reset token. For demo, the token is returned on-screen.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={requestReset} disabled={loading} className="w-full">
            Request reset
          </Button>
        </div>

        {tokenIssued && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Demo token: {tokenIssued}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Reset Token</Label>
            <Input
              id="token"
              type="text"
              placeholder="paste token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={confirmReset} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            Confirm reset
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            className="text-sm text-sky-600 hover:underline"
            onClick={() => navigate("/login")}
          >
            Back to login
          </button>
        </div>
      </Card>
    </div>
  );
}
