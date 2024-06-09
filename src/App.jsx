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
import { UserProfile } from "./pages/UserProfile";
import { Credentials } from "./pages/Credentials";
import { SelectDivision } from "./components/SelectDivision";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />}>
            <Route index element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users/:id/profile" element={<UserProfile />} />
            <Route path="/users/:id/credentials" element={<Credentials />} />
            <Route path="/users/:id" element={<SelectDivision />} />
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
