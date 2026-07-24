import { useState, type FormEvent, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import supabase from "../../lib/supabaseClient";

import { AuthCard } from "../../components/auth/AuthCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";


export const Login = (): ReactElement => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (

    e: FormEvent<HTMLFormElement>
  ) => {
    console.log("handleSubmit disparado");

    e.preventDefault();

    setError(null);
    setIsLoading(true);


    const {
      error: signInError
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    setIsLoading(false);

    if (signInError) {

      setError(signInError.message);
      return;

    }

    navigate("/");

  };

  return (

    <AuthCard

      title="Welcome back"

      description="Sign in to continue to Huella."

      footer={
        <p className=" text-center text-sm text-muted-foreground">

          Don't have an account?{" "}

          <Link
            to="/register"
            className=" font-medium text-primary hover:underline"
          >
            Register
          </Link>

        </p>
      }

    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >

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

        <Button type="submit" disabled={isLoading}>

          {isLoading ? "Logging in...": "Log in"}

        </Button>

      </form>

    </AuthCard>

  );
};