"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

interface SignUpFormProps {
  onSignUp: () => void;
  onSignInClick: () => void;
}

export function SignUpForm({ onSignUp, onSignInClick }: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select()
        .eq("userid", username)
        .single();

      if (existingUser) {
        setError("Username already exists");
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            userid: username,
            password_hash: hashedPassword,
            role: "user"
          }
        ]);

      if (insertError) throw insertError;
      onSignUp();
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Sign up to access your account
          </p>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-destructive text-center">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSignInClick}
              className="text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}