"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getMatieres, askQuestion } from "@/lib/api";

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
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Poser une question</CardTitle>
          <CardDescription>
            Posez une question sur le contenu des cours
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
            <label className="text-sm font-medium">Question</label>
            <Textarea
              placeholder="Entrez votre question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
              onClick={handleSubmit}
              disabled={isLoading || !selectedMatiere || !question.trim()}
            >
              {isLoading ? "Génération..." : "Poser la question"}
            </Button>
          </div>

          {response && (
            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Réponse</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {response.response}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sources</h3>
                <div className="space-y-4">
                  {response.sources.map((source, index) => (
                    <Card key={index}>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="font-medium">{source.source}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.section}
                          </p>
                          <p className="text-sm">{source.contenu}</p>
                          {source.relevance_score !== undefined && (
                            <p className="text-xs text-muted-foreground">
                              Score de pertinence: {source.relevance_score.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 