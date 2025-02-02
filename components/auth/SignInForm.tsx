"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

interface SignInFormProps {
  onSignIn: () => void;
  onSignUpClick: () => void;
}

export function SignInForm({ onSignIn, onSignUpClick }: SignInFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("userid", username)
        .single();

      if (error) throw error;
      
      if (data) {
        const isValidPassword = await bcrypt.compare(password, data.password_hash);
        if (isValidPassword) {
          onSignIn();
          return;
        }
      }
      
      setError("Invalid credentials");
    } catch (err) {
      setError("Invalid credentials");
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
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSignUpClick}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}