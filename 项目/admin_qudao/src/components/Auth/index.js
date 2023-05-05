import { getToken } from "../../utils/token";
import { Navigate } from "react-router-dom";
function Auth({ children }) {
  const isToken = getToken();
  if (isToken) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
export { Auth };
