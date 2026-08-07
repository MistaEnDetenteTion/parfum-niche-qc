import Link from "next/link";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen gradient-dark flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto animate-fadeInUp">
        {/* Logo / Brand */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gold-muted border border-gold/30 flex items-center justify-center animate-pulse-gold">
            <FlaskConical className="w-8 h-8 text-gold" />
          </div>
        </div>

        <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">
          Commerce de niche · Québec
        </p>

        <h1 className="text-5xl font-light tracking-tight mb-4 text-foreground">
          Parfum <br className="hidden sm:block" />
          <span className="text-gradient-gold font-normal">Ramzi</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Gestion et promotion de votre commerce de décants et parfums de niche.
          <br />
          Deux outils conçus pour votre activité au Québec.
        </p>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin"
            className="glass rounded-xl p-6 text-left hover:border-gold/30 transition-all duration-300 hover:bg-gold/5 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-gold" />
              </div>
              <span className="text-gold text-xs tracking-widest uppercase">Admin</span>
            </div>
            <h2 className="text-lg font-medium text-foreground mb-1">
              Centre de Commande
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Grossistes, lots, calcul de prix & marges, suivi des stocks.
            </p>
            <div className="flex items-center text-gold text-sm gap-1 group-hover:gap-2 transition-all">
              Accéder <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/story"
            className="glass rounded-xl p-6 text-left hover:border-gold/30 transition-all duration-300 hover:bg-gold/5 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gold-muted flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <span className="text-gold text-xs tracking-widest uppercase">Marketing</span>
            </div>
            <h2 className="text-lg font-medium text-foreground mb-1">
              Parfum du Jour
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Générez vos Stories Instagram 9:16 à télécharger en un clic.
            </p>
            <div className="flex items-center text-gold text-sm gap-1 group-hover:gap-2 transition-all">
              Accéder <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
