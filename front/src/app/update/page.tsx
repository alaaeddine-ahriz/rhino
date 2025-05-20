"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getMatieres, updateMatiere } from "@/lib/api";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UpdatePage() {
  const router = useRouter();
  const [matieres, setMatieres] = useState<string[]>([]);
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Charger les matières au montage du composant
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

  const handleUpdate = async () => {
    if (!selectedMatiere) {
      toast.error("Veuillez sélectionner une matière");
      return;
    }

    setIsLoading(true);
    try {
      const response = await updateMatiere(selectedMatiere);
      toast.success(`Mise à jour réussie pour ${selectedMatiere}`);
      router.push("/");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
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
                Documents
              </div>
              <h1 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Mise à jour des documents
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Synchronisez les documents d'une matière avec le système RAG
              </p>
            </div>
          </div>
          
          <div className="mx-auto max-w-3xl mt-10">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Sélectionnez une matière</CardTitle>
                <CardDescription>
                  Choisissez la matière dont vous souhaitez mettre à jour l'index
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

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="hover:bg-muted"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={isLoading || !selectedMatiere}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
} 