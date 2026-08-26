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
    const [agreedToPolicy, setAgreedToPolicy] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);



    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError(null);
        setIsLoading(true);

        if (!agreedToPolicy) {
            setError("You must accept the Privacy Policy and Terms to create an account.");
            setIsLoading(false);
            return;
        }

        const { data, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

        if (signUpError) {
            setIsLoading(false);
            setError(signUpError.message);
            return;
        }

        // Si el correo ya existe y ya está confirmado, Supabase regresa un
        // usuario "fantasma" con identities vacío en vez de un error
        // (protección contra enumeración de correos). Lo detectamos así.
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            setIsLoading(false);
            setError(
                "That email is already registered. Try logging in instead."
            );
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

                <p className="text-centertext-smtext-muted-foreground">

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

                <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                    We collect your name, phone, photos, and location to publish lost/found pet
                    reports. Contact info you add to a report is shown publicly so others can
                    reach you. See our{" "}
                    <Link to="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                        Privacy Policy
                    </Link>{" "}
                    for details on how your data is stored and used.
                </div>

                <label className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={agreedToPolicy}
                        onChange={(e) => setAgreedToPolicy(e.target.checked)}
                        className="mt-0.5"
                        required
                    />
                    <span>
                        I have read and agree to the{" "}
                        <Link to="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link to="/terms" target="_blank" className="font-medium text-primary hover:underline">
                            Terms of Service
                        </Link>
                        .
                    </span>
                </label>

                <Button type="submit" disabled={isLoading}>

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