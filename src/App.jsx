import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import Auth from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
