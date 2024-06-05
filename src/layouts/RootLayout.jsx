import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
    return (
        <div className="mx-auto px-5 ">
            <header className="text-center py-5">
                <h2 className="text-2xl italic">
                    Seamlessly manage all employee credentials
                </h2>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="text-center py-5">Built by Faiz Kirsten</footer>
        </div>
    );
}
