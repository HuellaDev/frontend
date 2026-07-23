import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactElement } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Camera, X } from "lucide-react";
import { createLostReport, createSightingReport, uploadReportPhoto } from "../../lib/reportsApi";
import { useGeolocation, type GeoLocation } from "../../hooks/useGeolocation";
import { LocationPicker } from "../../components/map/LocationPicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ReportKind = "lost" | "sighting";

const MERIDA_FALLBACK: GeoLocation = { longitude: -89.6237, latitude: 20.9674 };

export const CreateReport = (): ReactElement => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { location: gpsLocation, isLocating, error: locationError, locate } = useGeolocation();

  const [kind, setKind] = useState<ReportKind>("lost");
  const [pinLocation, setPinLocation] = useState<GeoLocation | null>(null);
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [description, setDescription] = useState("");
  const [petName, setPetName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [radiusMeters, setRadiusMeters] = useState("1000");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const mapCenter = gpsLocation ?? MERIDA_FALLBACK;
  const finalLocation = pinLocation ?? gpsLocation;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        species,
        breed: breed || undefined,
        main_color: mainColor || undefined,
        description: description || undefined,
        pet_name: kind === "lost" ? petName || undefined : undefined,
        contact_phone: kind === "lost" ? contactPhone || undefined : undefined,
        reward_amount: kind === "lost" && rewardAmount ? Number(rewardAmount) : undefined,
        search_radius_meters: kind === "lost" ? Number(radiusMeters) : undefined,
        coordinates: [finalLocation!.longitude, finalLocation!.latitude] as [number, number],
      };

      const report =
        kind === "lost" ? await createLostReport(payload) : await createSightingReport(payload);

      const reportId = kind === "lost" ? report.lostReport.id : report.sightingReport.id;

      if (photo) {
        await uploadReportPhoto(photo, reportId, kind);
      }

      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lost-reports"] });
      queryClient.invalidateQueries({ queryKey: ["sighting-reports"] });
      navigate("/");
    },
  });

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPhoto(e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setFormError(null);

    if (!species.trim()) {
      setFormError("Species is required.");
      return;
    }

    if (!finalLocation) {
      setFormError('Please set a location using "Use my location".');
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">New Report</h1>

      <div className="mb-6 flex gap-1 rounded-full border border-border p-1 text-sm">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setKind("lost")}
          className={`flex-1 rounded-full ${
            kind === "lost" ? "bg-red-500 text-white hover:bg-red-500 hover:text-white" : ""
          }`}
        >
          Lost
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setKind("sighting")}
          className={`flex-1 rounded-full ${
            kind === "sighting" ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white" : ""
          }`}
        >
          Sighted
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {kind === "lost" && (
          <div className="space-y-2">
            <Label htmlFor="petName">Pet name</Label>
            <Input id="petName" value={petName} onChange={(e) => setPetName(e.target.value)} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="species">Species *</Label>
          <Input
            id="species"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="dog, cat..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="labrador, siamese..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainColor">Main color</Label>
          <Input id="mainColor" value={mainColor} onChange={(e) => setMainColor(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {kind === "lost" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact phone</Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewardAmount">Reward amount (USD)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  id="rewardAmount"
                  type="number"
                  min={0}
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="radiusMeters">Search radius: {radiusMeters}m</Label>
              <input
                id="radiusMeters"
                type="range"
                min={100}
                max={10000}
                step={100}
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Photo (recommended)</Label>

          {photoPreview ? (
            <div className="relative w-fit">
              <img
                src={photoPreview}
                alt="Selected pet"
                className="h-32 w-32 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background shadow-sm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-6 text-sm text-muted-foreground hover:bg-muted">
              <Camera className="h-6 w-6" />
              <span>Click to upload a photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="space-y-2">
          <Label>Location *</Label>
          <Button
            type="button"
            variant="outline"
            onClick={locate}
            disabled={isLocating}
            className="w-full"
          >
            {isLocating ? "Locating..." : gpsLocation ? "Location found ✓" : "Use my location"}
          </Button>
          {locationError && <p className="text-sm text-red-600">{locationError}</p>}

          <p className="text-xs text-muted-foreground">Drag the pin to adjust the exact spot.</p>
          <LocationPicker center={mapCenter} value={pinLocation} onChange={setPinLocation} />
        </div>

        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>Something went wrong. Please try again.</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit report"}
        </Button>
      </form>
    </div>
  );
};