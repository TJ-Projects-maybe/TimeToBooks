"use client"

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
        photoURL: session.user.user_metadata?.avatar_url,
      } : null);
      setLoading(false);
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
        photoURL: session.user.user_metadata?.avatar_url,
      } : null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
};
