"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "Erreur réseau ou URL invalide");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl relative z-10 animate-fadeInUp">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-muted border border-gold/20 flex items-center justify-center mx-auto mb-2">
            <FlaskConical className="w-6 h-6 text-gold" />
          </div>
          <CardTitle className="text-2xl font-light tracking-tight">Parfums Ramzi</CardTitle>
          <CardDescription>Accès restreint au centre de commande</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-muted/50"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error === "Invalid login credentials" ? "Identifiants incorrects." : error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full gradient-gold text-primary-foreground font-medium"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
