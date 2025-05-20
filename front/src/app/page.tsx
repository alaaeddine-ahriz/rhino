import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Le Rhino - Assistant de Révision</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/update">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Mise à jour des documents</CardTitle>
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

        <Link href="/question">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Poser une question</CardTitle>
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

        <Link href="/reflection">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Questions de réflexion</CardTitle>
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
  );
}
