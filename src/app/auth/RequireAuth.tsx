import { Navigate } from "react-router-dom";
import { getAccessToken } from "./store";

type Props = {
  children: React.ReactElement;
};

export function RequireAuth({ children }: Props) {
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
