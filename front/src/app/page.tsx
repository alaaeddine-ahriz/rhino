import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section with Split Layout */}
      <section className="flex-1 w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Assistant de Révision
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Le Rhino
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Votre compagnon intelligent pour une révision efficace et interactive
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl transform -rotate-1"></div>
              <div className="relative bg-card rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Comment ça marche ?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
                    <span>Mettez à jour vos documents</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
                    <span>Posez vos questions</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
                    <span>Testez votre compréhension</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="w-full py-12 md:py-24 bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Fonctionnalités
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Explorez nos fonctionnalités</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Découvrez comment Le Rhino peut transformer votre expérience d'apprentissage
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-8 md:pt-12">
            <Link href="/update" className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    Mise à jour des documents
                  </CardTitle>
                  <CardDescription>
                    Mettre à jour l'index des documents pour une matière
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Synchronisez les documents d'une matière avec le système RAG
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/question" className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    Poser une question
                  </CardTitle>
                  <CardDescription>
                    Obtenir une réponse basée sur les documents du cours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Posez vos questions sur le contenu des cours
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reflection" className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    Questions de réflexion
                  </CardTitle>
                  <CardDescription>
                    Générer et répondre à des questions de réflexion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Testez votre compréhension avec des questions approfondies
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-muted/20 to-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Commencez maintenant
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Prêt à commencer ?</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Choisissez une fonctionnalité pour commencer votre session de révision
            </p>
          </div>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/update"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Mettre à jour les documents
            </Link>
            <Link
              href="/question"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-muted transition-colors"
            >
              Poser une question
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
