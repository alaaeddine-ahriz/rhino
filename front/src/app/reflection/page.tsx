"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getMatieres, generateReflectionQuestion, evaluateResponse, ReflectionQuestion, EvaluationResponse } from "@/lib/api";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReflectionPage() {
  const router = useRouter();
  const [matieres, setMatieres] = useState<string[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [conceptCle, setConceptCle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [question, setQuestion] = useState<ReflectionQuestion | null>(null);
  const [reponse, setReponse] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);

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

  const handleGenerateQuestion = async () => {
    if (!selectedMatiere || !conceptCle.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await generateReflectionQuestion(selectedMatiere, conceptCle);
      setQuestion(response.data);
      setReponse("");
      setEvaluation(null);
    } catch (error) {
      toast.error("Erreur lors de la génération de la question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!reponse.trim()) {
      toast.error("Veuillez entrer votre réponse");
      return;
    }

    if (!question) {
      toast.error("Aucune question n'a été générée");
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await evaluateResponse(selectedMatiere, question.question, reponse);
      setEvaluation(response.data);
    } catch (error) {
      toast.error("Erreur lors de l'évaluation de la réponse");
    } finally {
      setIsEvaluating(false);
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
                Réflexion
              </div>
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Questions de réflexion
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Testez votre compréhension avec des questions approfondies
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-3xl mt-10">
            {/* Question Generator */}
            {!question && (
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Générer une question</CardTitle>
                  <CardDescription>
                    Sélectionnez une matière et un concept clé
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
                      <label className="text-sm font-medium">Concept clé</label>
                      <Textarea
                        placeholder="Entrez un concept clé..."
                        value={conceptCle}
                        onChange={(e) => setConceptCle(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                      >
                        Retour
                      </Button>
                      <Button
                        onClick={handleGenerateQuestion}
                        disabled={isLoading || !selectedMatiere || !conceptCle.trim()}
                      >
                        {isLoading ? "Génération..." : "Générer une question"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Question Display */}
            {question && !evaluation && (
              <div className="space-y-8">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Question</CardTitle>
                    <CardDescription>
                      Répondez à la question suivante
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <p className="text-lg">{question.question}</p>

                      <div className="grid gap-4">
                        {question.concepts_abordés && question.concepts_abordés.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Concepts abordés</h3>
                            <div className="flex flex-wrap gap-2">
                              {question.concepts_abordés.map((concept, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-primary/10 text-primary"
                                >
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.niveau_difficulté && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Niveau de difficulté</h3>
                            <Badge variant="secondary">{question.niveau_difficulté}</Badge>
                          </div>
                        )}

                        {question.compétences_visées && question.compétences_visées.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Compétences visées</h3>
                            <ul className="space-y-2">
                              {question.compétences_visées.map((comp, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
                                  <span className="text-muted-foreground text-sm">{comp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader>
                    <CardTitle>Votre réponse</CardTitle>
                    <CardDescription>
                      Rédigez votre réponse à la question
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Entrez votre réponse..."
                        value={reponse}
                        onChange={(e) => setReponse(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmit}
                          disabled={!reponse.trim() || isEvaluating}
                        >
                          {isEvaluating ? "Évaluation..." : "Soumettre"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Evaluation Results */}
            {evaluation && (
              <div className="space-y-8">
                <Card className="border shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Résultat de l'évaluation</CardTitle>
                      <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-2xl font-bold">
                        {evaluation.evaluation.note}/100
                      </div>
                    </div>
                    <CardDescription>
                      Évaluation de votre réponse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">✨</span>
                          <h3 className="font-medium text-lg">Points forts</h3>
                        </div>
                        <ul className="space-y-3">
                          {evaluation.evaluation.points_forts.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-green-500 mt-1">✓</span>
                              <span className="text-muted-foreground">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">💡</span>
                          <h3 className="font-medium text-lg">Axes d'amélioration</h3>
                        </div>
                        <ul className="space-y-3">
                          {evaluation.evaluation.points_ameliorer.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-orange-500 mt-1">!</span>
                              <span className="text-muted-foreground">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium text-lg mb-4">Feedback détaillé</h3>
                      <div className="bg-muted/30 p-6 rounded-xl">
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {evaluation.evaluation.conseil_personnalise}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuestion(null);
                          setReponse("");
                          setEvaluation(null);
                        }}
                      >
                        Nouvelle question
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                      >
                        Retour à l'accueil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 