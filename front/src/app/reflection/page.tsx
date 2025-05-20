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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      console.log("Question data received:", response.data);
      
      // The API returns data.question which may be a JSON string that needs to be parsed
      let parsedQuestion;
      
      if (response.data && typeof response.data.question === 'string') {
        try {
          // Try to parse the question field as JSON
          parsedQuestion = JSON.parse(response.data.question);
          console.log("Successfully parsed question JSON string:", parsedQuestion);
        } catch (e) {
          console.error("Error parsing question JSON:", e);
          // If parsing fails, use the string directly
          parsedQuestion = {
            question: response.data.question,
            matiere: response.data.matiere,
            concept: response.data.concept,
            format: response.data.format
          };
        }
      } else {
        // If data.question is not a string, use the data directly
        parsedQuestion = response.data;
      }
      
      console.log("Final parsed question data:", parsedQuestion);
      setQuestion(parsedQuestion);
      setReponse("");
      setEvaluation(null);
    } catch (error) {
      console.error("Error generating question:", error);
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
      // Extract the question text, handling both string and nested object cases
      const questionText = typeof question.question === 'string' 
        ? question.question 
        : question.question?.question || '';
        
      const response = await evaluateResponse(selectedMatiere, questionText, reponse);
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
                      {/* Display the question text directly from the parsed object */}
                      <p className="text-lg">{
                        // Display the question text from the correct property
                        typeof question?.question === 'string' 
                          ? question.question 
                          : question?.question?.question || ''
                      }</p>

                      {/* Display metadata from the parsed object */}
                      <div className="grid gap-4">
                        {/* Helper function to safely access properties */}
                        {(() => {
                          // Get concepts from the appropriate location
                          const concepts = typeof question?.question === 'object' 
                            ? question.question?.concepts_abordés 
                            : question?.concepts_abordés;
                            
                          if (concepts && concepts.length > 0) {
                            return (
                              <div>
                                <h3 className="text-sm font-medium mb-2">Concepts abordés</h3>
                                <div className="flex flex-wrap gap-2">
                                  {concepts.map((concept: string, index: number) => (
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
                            );
                          }
                          return null;
                        })()}

                        {/* Show difficulty level */}
                        {(() => {
                          const difficultyLevel = typeof question?.question === 'object' 
                            ? question.question?.niveau_difficulté 
                            : question?.niveau_difficulté;
                            
                          if (difficultyLevel) {
                            return (
                              <div>
                                <h3 className="text-sm font-medium mb-2">Niveau de difficulté</h3>
                                <Badge variant="secondary">{difficultyLevel}</Badge>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Show targeted skills */}
                        {/* {(() => {
                          const skills = typeof question?.question === 'object' 
                            ? question.question?.compétences_visées 
                            : question?.compétences_visées;
                            
                          if (skills && skills.length > 0) {
                            return (
                              <div>
                                <h3 className="text-sm font-medium mb-2">Compétences visées</h3>
                                <ul className="space-y-2">
                                  {skills.map((comp: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
                                      <span className="text-muted-foreground text-sm">{comp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return null;
                        })()} */}
                        
                        {/* Show response elements */}
                        {/* {(() => {
                          const responseElements = typeof question?.question === 'object' 
                            ? question.question?.éléments_réponse 
                            : question?.éléments_réponse;
                            
                          if (responseElements && responseElements.length > 0) {
                            return (
                              <div>
                                <h3 className="text-sm font-medium mb-2">Éléments de réponse attendus</h3>
                                <ul className="space-y-2">
                                  {responseElements.map((element: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></div>
                                      <span className="text-muted-foreground text-sm">{element}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          }
                          return null;
                        })()} */}
                      </div>
                      
                      <div className="pt-6 border-t border-border">
                        <h3 className="font-medium text-base mb-3">Votre réponse</h3>
                        <Textarea
                          placeholder="Entrez votre réponse..."
                          value={reponse}
                          onChange={(e) => setReponse(e.target.value)}
                          className="min-h-[200px] resize-none"
                        />
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleSubmit}
                            disabled={!reponse.trim() || isEvaluating}
                          >
                            {isEvaluating ? "Évaluation..." : "Soumettre"}
                          </Button>
                        </div>
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
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Évaluation</CardTitle>
                        <CardDescription>
                          Analyse détaillée de votre réponse
                        </CardDescription>
                      </div>
                      <div className="bg-primary rounded-md px-5 py-2.5 text-primary-foreground">
                        <span className="text-2xl font-bold">{evaluation.evaluation.note}</span>
                        <span className="text-xl">/100</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:gap-6">
                      <div className="flex-1 border-l-4 border-green-400 bg-green-50/50 dark:bg-green-950/10 p-5 rounded-md">
                        <h3 className="font-medium text-base border-b pb-2 mb-3">Points forts</h3>
                        <ul className="space-y-2">
                          {evaluation.evaluation.points_forts.map((point, index) => (
                            <li key={index} className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {point}
                              </ReactMarkdown>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1 border-l-4 border-amber-400 bg-amber-50/50 dark:bg-amber-950/10 p-5 rounded-md">
                        <h3 className="font-medium text-base border-b pb-2 mb-3">Axes d'amélioration</h3>
                        <ul className="space-y-2">
                          {evaluation.evaluation.points_ameliorer.map((point: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground prose prose-sm dark:prose-invert">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {point}
                              </ReactMarkdown>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium text-base border-b pb-2 mb-3">Feedback détaillé</h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {evaluation.evaluation.conseil_personnalise}
                        </ReactMarkdown>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-medium text-base border-b pb-2 mb-3">Proposition de réponse</h3>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {evaluation.evaluation.reponse_modele}
                        </ReactMarkdown>
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