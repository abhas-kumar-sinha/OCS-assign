"use client";

import { useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { UserTable } from "@/components/users/UserTable";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  if (isSignedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
        <UserTable onSignOut={() => setIsSignedIn(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      {showSignUp ? (
        <SignUpForm 
          onSignUp={() => setIsSignedIn(true)} 
          onSignInClick={() => setShowSignUp(false)}
        />
      ) : (
        <SignInForm 
          onSignIn={() => setIsSignedIn(true)} 
          onSignUpClick={() => setShowSignUp(true)}
        />
      )}
    </main>
  );
}