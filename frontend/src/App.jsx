import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppRouter from "./routers/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
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
