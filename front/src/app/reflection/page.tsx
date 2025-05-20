"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getMatieres, generateReflectionQuestion, evaluateResponse, ReflectionQuestion, EvaluationResponse } from "@/lib/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function ReflectionPage() {
  const router = useRouter();
  const [matieres, setMatieres] = useState<string[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [conceptCle, setConceptCle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [question, setQuestion] = useState<ReflectionQuestion | null>(null);
  const [reponse, setReponse] = useState("");
  const [evaluation, setEvaluation] = useState<ApiResponse<EvaluationResponse> | null>(null);

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
      setEvaluation(response);
    } catch (error) {
      toast.error("Erreur lors de l'évaluation de la réponse");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Questions de réflexion</CardTitle>
          <CardDescription>
            Testez votre compréhension avec des questions approfondies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
              className="min-h-[100px]"
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

          {question && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Question</h3>
                      <p className="text-muted-foreground">{question.question}</p>
                    </div>

                    {question.concepts_abordés && question.concepts_abordés.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Concepts abordés</h4>
                        <div className="flex flex-wrap gap-2">
                          {question.concepts_abordés.map((concept, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.niveau_difficulté && (
                      <div>
                        <h4 className="font-medium mb-1">Niveau de difficulté</h4>
                        <p className="text-muted-foreground">{question.niveau_difficulté}</p>
                      </div>
                    )}

                    {question.compétences_visées && question.compétences_visées.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1">Compétences visées</h4>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {question.compétences_visées.map((comp, index) => (
                            <li key={index}>{comp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {!evaluation ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Votre réponse</label>
                    <Textarea
                      placeholder="Entrez votre réponse..."
                      value={reponse}
                      onChange={(e) => setReponse(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmit}
                      disabled={!reponse.trim() || isEvaluating}
                    >
                      {isEvaluating ? "Évaluation..." : "Soumettre"}
                    </Button>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* En-tête de l'évaluation */}
                      <div className="flex justify-between items-center border-b pb-4">
                        <h3 className="text-lg font-semibold">Résultat de l'évaluation</h3>
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-2xl font-bold">
                          {evaluation.data.evaluation.note}/100
                        </div>
                      </div>

                      {/* Points forts et points à améliorer */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Points forts */}
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">✨</span>
                            <h4 className="font-medium">Points forts</h4>
                          </div>
                          <ul className="space-y-2">
                            {evaluation.data.evaluation.points_forts.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Points à améliorer */}
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🔧</span>
                            <h4 className="font-medium">Points à améliorer</h4>
                          </div>
                          <ul className="space-y-2">
                            {evaluation.data.evaluation.points_ameliorer.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-500">⚡</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Réponse modèle */}
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📝</span>
                          <h4 className="font-medium">Réponse modèle</h4>
                        </div>
                        <p className="italic">{evaluation.data.evaluation.reponse_modele}</p>
                      </div>

                      {/* Justification de la note */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📊</span>
                          <h4 className="font-medium">Justification de la note</h4>
                        </div>
                        <p>{evaluation.data.evaluation.justification_note}</p>
                      </div>

                      {/* Conseil personnalisé */}
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">💡</span>
                          <h4 className="font-medium">Conseil personnalisé</h4>
                        </div>
                        <p>{evaluation.data.evaluation.conseil_personnalise}</p>
                      </div>

                      {/* Bouton nouvelle réponse */}
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEvaluation(null);
                            setReponse("");
                          }}
                        >
                          <span className="mr-2">🔄</span>
                          Nouvelle réponse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 