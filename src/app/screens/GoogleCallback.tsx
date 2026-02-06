import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens, setUserEmail } from "../auth/store";
import { toast } from "sonner";

export function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refresh_token");
    const email = params.get("email");

    if (token && refreshToken && email) {
      setTokens(token, refreshToken);
      setUserEmail(email);
      toast.success("Signed in with Google");
      navigate("/dashboard", { replace: true });
    } else {
      toast.error("Google sign-in failed");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-600">Signing you in...</p>
    </div>
  );
}
