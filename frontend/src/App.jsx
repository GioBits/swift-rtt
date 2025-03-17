import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppRouter from "./routers/AppRouter";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authActions";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser()); // ✅ Check user session on page load
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-bg w-[100vw] h-[100vh]">
        <AppRouter />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
