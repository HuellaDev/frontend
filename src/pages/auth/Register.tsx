import { useState, type FormEvent, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import supabase from "../../lib/supabaseClient";
import api from "../../lib/api";

import { AuthCard } from "../../components/auth/AuthCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";


export const Register = (): ReactElement => {

    const navigate = useNavigate();


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        setError(null);
        setIsLoading(true);



        const { data, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
            });



        if (signUpError) {

            setIsLoading(false);
            setError(signUpError.message);
            return;

        }



        if (!data.session) {

            setIsLoading(false);

            setError(
                "Check your email to confirm your account before logging in."
            );

            return;

        }



        try {

            await api.post("/profile", {
                full_name: fullName,
            });


        } catch {

            setIsLoading(false);

            setError(
                "Account created, but we could not set up your profile."
            );

            return;

        }



        setIsLoading(false);

        navigate("/");

    };



    return (

        <AuthCard

            title="Create account"

            description="Join Huella and help animals in your community."

            footer={

                <p className="
          text-center
          text-sm
          text-muted-foreground
        ">

                    Already have an account?{" "}


                    <Link
                        to="/login"
                        className=" font-medium text-primary hover:underline"
                    >
                        Log in
                    </Link>


                </p>

            }

        >


            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
            >



                <div className="space-y-2">

                    <Label htmlFor="fullName">
                        Full name
                    </Label>


                    <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                </div>



                <div className="space-y-2">

                    <Label htmlFor="email">
                        Email
                    </Label>


                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                </div>



                <div className="space-y-2">

                    <Label htmlFor="password">
                        Password
                    </Label>


                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />

                </div>



                {error && (

                    <Alert variant="destructive">

                        <AlertDescription>
                            {error}
                        </AlertDescription>

                    </Alert>

                )}



                <Button
                    disabled={isLoading}
                >

                    {
                        isLoading
                            ? "Creating account..."
                            : "Create account"
                    }

                </Button>


            </form>


        </AuthCard>

    );
};