import type { Dispatch, ReactElement, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ReportKind } from "./ReportTypeSelector";

interface AnimalInformationProps {
  kind: ReportKind;

  petName: string;
  setPetName: Dispatch<SetStateAction<string>>;

  species: string;
  setSpecies: Dispatch<SetStateAction<string>>;

  breed: string;
  setBreed: Dispatch<SetStateAction<string>>;

  mainColor: string;
  setMainColor: Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}

export const AnimalInformation = ({
  kind,

  petName,
  setPetName,

  species,
  setSpecies,

  breed,
  setBreed,

  mainColor,
  setMainColor,

  description,
  setDescription,
}: AnimalInformationProps): ReactElement => {
  return (
    <>
      {kind === "lost" && (
        <div className="space-y-2">
          <Label htmlFor="petName">Pet name</Label>

          <Input
            id="petName"
            placeholder="Bella, Max..."
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="species">Species *</Label>

        <Input
          id="species"
          required
          placeholder="Dog, Cat..."
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>

        <Input
          id="breed"
          placeholder="Golden Retriever..."
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mainColor">Main color</Label>

        <Input
          id="mainColor"
          placeholder="Brown, Black..."
          value={mainColor}
          onChange={(e) => setMainColor(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          rows={4}
          placeholder="Describe the animal, collar, size, behavior..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </>
  );
};