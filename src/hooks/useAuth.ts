import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import supabase from "../lib/supabaseClient";
import api from "../lib/api";

interface UseAuthResult {
  session: Session | null;
  isLoading: boolean;
}

export const useAuth = (): UseAuthResult => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const ensureProfile = async (currentSession: Session) => {
    try {
      // Verificar si ya existe
      await api.get("/profile/me");

    } catch (error: any) {

      // Solo crear si realmente no existe
      if (error.response?.status === 404) {

        await api.post("/profile", {
          full_name:
            currentSession.user.user_metadata.full_name ??
            currentSession.user.email?.split("@")[0] ??
            "User",
        });

      }

    }
  };


  useEffect(() => {

    const initAuth = async () => {

      const { data } = await supabase.auth.getSession();

      const currentSession = data.session;

      setSession(currentSession);


      if (currentSession) {
        await ensureProfile(currentSession);
      }


      setIsLoading(false);
    };


    initAuth();


    const { data: listener } =
      supabase.auth.onAuthStateChange(
        async (_event, newSession) => {

          setSession(newSession);


          if (newSession) {
            await ensureProfile(newSession);
          }

        }
      );


    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);


  return {
    session,
    isLoading,
  };
};