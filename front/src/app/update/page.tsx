"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getMatieres, updateMatiere } from "@/lib/api";

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
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mise à jour des documents</CardTitle>
          <CardDescription>
            Sélectionnez une matière pour mettre à jour son index
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Annuler
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isLoading || !selectedMatiere}
            >
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 