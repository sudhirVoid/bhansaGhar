import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AppRouter from "@/routes/AppRouter";
import { Toaster } from "sonner";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRouter />
                <Toaster position="top-right" richColors />
            </BrowserRouter>            
        </AuthProvider>
    );
}

export default App;
