"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getMatieres, askQuestion } from "@/lib/api";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuestionPage() {
  const router = useRouter();
  const [matieres, setMatieres] = useState<string[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    response: string;
    sources: Array<{
      source: string;
      section: string;
      contenu: string;
      relevance_score?: number;
    }>;
  } | null>(null);

  useEffect(() => {
    const loadMatieres = async () => {
      try {
        const response = await getMatieres();
        setMatieres(response.data.matieres);
      } catch (error) {
        toast.error("Erreur lors du chargement des matières");
      }
    };
    loadMatieres();
  }, []);

  const handleSubmit = async () => {
    if (!selectedMatiere || !question.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await askQuestion(selectedMatiere, question);
      setResponse(response.data);
    } catch (error) {
      toast.error("Erreur lors de la génération de la réponse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      
      <section className="flex-1 w-full py-12 md:py-24 bg-gradient-to-b from-background to-muted/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Questions
              </div>
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Posez une question
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Obtenez des réponses précises basées sur le contenu de vos cours
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl mt-10">
            {!response && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Votre question</CardTitle>
                  <CardDescription>
                    Sélectionnez une matière et posez votre question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Matière</label>
                      <Select
                        value={selectedMatiere}
                        onValueChange={setSelectedMatiere}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une matière" />
                        </SelectTrigger>
                        <SelectContent>
                          {matieres.map((matiere) => (
                            <SelectItem key={matiere} value={matiere}>
                              {matiere}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Question</label>
                      <Textarea
                        placeholder="Entrez votre question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                      >
                        Retour
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedMatiere || !question.trim()}
                      >
                        {isLoading ? "Génération..." : "Poser la question"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {response && (
              <div className="space-y-8">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Question</CardTitle>
                    <CardDescription>
                      {question}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Réponse</CardTitle>
                    <CardDescription>
                      Réponse générée à partir de vos documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground whitespace-pre-wrap">
                      {response.response}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Sources</h2>
                  <div className="grid gap-4">
                    {response.sources.map((source, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardHeader className="bg-muted/30 py-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{source.source}</div>
                            {source.relevance_score !== undefined && (
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                Score: {source.relevance_score.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {source.section}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="bg-muted/20 p-3 rounded-md text-sm">
                            {source.contenu}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setResponse(null)}
                  >
                    Poser une autre question
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 