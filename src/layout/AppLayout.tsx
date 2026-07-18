import type { ReactElement } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import supabase from "../lib/supabaseClient";


export const AppLayout = (): ReactElement => {

    const { session } = useAuth();

    const navigate = useNavigate();



    const handleLogout = async (): Promise<void> => {

        await supabase.auth.signOut();

        navigate("/login");

    };



    const linkStyle = `
        text-muted-foreground
        hover:text-foreground
        transition-colors
    `;



    return (

        <div className="
            flex
            min-h-screen
            flex-col
            bg-background
            text-foreground
        ">


            <header className="
                border-b
                border-border
                bg-background
            ">


                <nav className="
                    mx-auto
                    flex
                    max-w-5xl
                    items-center
                    gap-6
                    px-4
                    py-4
                ">


                    <Link
                        to="/"
                        className="font-semibold"
                    >
                        Huella
                    </Link>



                    <div className="
                        ml-auto
                        flex
                        items-center
                        gap-6
                        text-sm
                    ">


                        <Link to="/" className={linkStyle}>
                            Map
                        </Link>



                        {session ? (

                            <>

                                <Link
                                    to="/reports/mine"
                                    className={linkStyle}
                                >
                                    My Reports
                                </Link>


                                <Link
                                    to="/reports/new"
                                    className={linkStyle}
                                >
                                    New Report
                                </Link>


                                <Link
                                    to="/settings"
                                    className={linkStyle}
                                >
                                    Settings
                                </Link>


                                <button
                                    onClick={handleLogout}
                                    className={linkStyle}
                                >
                                    Logout
                                </button>


                            </>


                        ) : (

                            <>

                                <Link
                                    to="/login"
                                    className={linkStyle}
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    className={linkStyle}
                                >
                                    Register
                                </Link>


                            </>

                        )}


                    </div>


                </nav>


            </header>



            <main className="
                mx-auto
                flex
                flex-1
                w-full
                max-w-5xl
                px-4
                py-8
            ">

                <Outlet />

            </main>


        </div>

    );

};