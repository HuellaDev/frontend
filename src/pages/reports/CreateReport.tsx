import { useState, type FormEvent, type ReactElement } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  createLostReport,
  createSightingReport,
  uploadReportPhoto,
} from "../../lib/reportsApi";

import {
  useGeolocation,
  type GeoLocation,
} from "../../hooks/useGeolocation";

import {
  AnimalInformation,
  LocationSection,
  LostInformation,
  PhotoUploader,
  ReportTypeSelector,
  type ReportKind,
} from "@/components/report-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const MERIDA_FALLBACK: GeoLocation = {
  longitude: -89.6237,
  latitude: 20.9674,
};

export const CreateReport = (): ReactElement => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    location: gpsLocation,
    isLocating,
    error: locationError,
    locate,
  } = useGeolocation();

  const [kind, setKind] = useState<ReportKind>("lost");

  const [pinLocation, setPinLocation] =
    useState<GeoLocation | null>(null);

  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [description, setDescription] = useState("");

  const [petName, setPetName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [radiusMeters, setRadiusMeters] = useState("1000");

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);


  const mapCenter = gpsLocation ?? MERIDA_FALLBACK;

  const finalLocation = pinLocation ?? gpsLocation;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!finalLocation) {
        throw new Error("Location is required");
      }

      const payload = {
        species,
        breed: breed || undefined,
        main_color: mainColor || undefined,
        description: description || undefined,

        pet_name:
          kind === "lost"
            ? petName || undefined
            : undefined,

        contact_phone:
          kind === "lost"
            ? contactPhone || undefined
            : undefined,

        reward_amount:
          kind === "lost" && rewardAmount
            ? Number(rewardAmount)
            : undefined,

        search_radius_meters:
          kind === "lost"
            ? Number(radiusMeters)
            : undefined,

        coordinates: [
          finalLocation.longitude,
          finalLocation.latitude,
        ] as [number, number],
      };

      const report =
        kind === "lost"
          ? await createLostReport(payload)
          : await createSightingReport(payload);

      const reportId =
        kind === "lost"
          ? report.lostReport.id
          : report.sightingReport.id;

      if (photo) {
        await uploadReportPhoto(
          photo,
          reportId,
          kind,
        );
      }

      return report;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lost-reports"],
      });

      queryClient.invalidateQueries({
        queryKey: ["sighting-reports"],
      });

      navigate("/");
    },
  });

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>,
  ): void => {
    e.preventDefault();

    setFormError(null);

    if (!species.trim()) {
      setFormError("Species is required.");
      return;
    }

    if (!finalLocation) {
      setFormError(
        'Please set a location using "Use my location".',
      );

      return;
    }

    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold">
          New Report
        </h1>
        <p className="text-sm text-muted-foreground">
          Report a lost pet or an animal sighting.
        </p>
      </div>

      <ReportTypeSelector
        kind={kind}
        onChange={setKind}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        
        <AnimalInformation
          kind={kind}

          petName={petName}
          setPetName={setPetName}

          species={species}
          setSpecies={setSpecies}

          breed={breed}
          setBreed={setBreed}

          mainColor={mainColor}
          setMainColor={setMainColor}

          description={description}
          setDescription={setDescription}
        />

        {kind === "lost" && (
          <LostInformation
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}

            rewardAmount={rewardAmount}
            setRewardAmount={setRewardAmount}

            radiusMeters={radiusMeters}
            setRadiusMeters={setRadiusMeters}
          />
        )}

        <PhotoUploader
          photo={photo}
          setPhoto={setPhoto}

          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
        />

        <LocationSection
          mapCenter={mapCenter}

          pinLocation={pinLocation}
          setPinLocation={setPinLocation}

          gpsLocation={gpsLocation}

          isLocating={isLocating}
          locationError={locationError}

          locate={locate}
        />

        {formError && (
          <Alert variant="destructive">
            <AlertDescription>
              {formError}
            </AlertDescription>
          </Alert>
        )}


        {mutation.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? "Submitting..."
            : "Submit report"}
        </Button>

      </form>
    </div>
  );
};