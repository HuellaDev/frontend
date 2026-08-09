import {
  useState,
  type FormEvent,
  type ReactElement,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useNavigate,
} from "react-router-dom";

import {
  createOrganization,
  uploadOrganizationPhoto,
} from "../../lib/organizationsApi";

import {
  useGeolocation,
  type GeoLocation,
} from "../../hooks/useGeolocation";

import {
  PhotoUploader,
  LocationSection,
} from "@/components/report-form";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  Textarea,
} from "@/components/ui/textarea";


const MERIDA_FALLBACK: GeoLocation = {
  longitude: -89.6237,
  latitude: 20.9674,
};


export const BecomeHelpCenterSection = (): ReactElement => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const {
    location: gpsLocation,
    isLocating,
    error: locationError,
    locate,
  } = useGeolocation();


  const [pinLocation, setPinLocation] =
    useState<GeoLocation | null>(null);


  const [name, setName] =
    useState("");

  const [type, setType] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [description, setDescription] =
    useState("");


  const [photo, setPhoto] =
    useState<File | null>(null);


  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);


  const [formError, setFormError] =
    useState<string | null>(null);


  const mapCenter =
    gpsLocation ?? MERIDA_FALLBACK;


  const finalLocation =
    pinLocation ?? gpsLocation;


  const mutation = useMutation({
    mutationFn: async () => {

      if (!finalLocation) {
        throw new Error("Location is required");
      }


      const payload = {
        name,
        type,
        phone: phone || undefined,
        address: address || undefined,
        description: description || undefined,

        location: {
          type: "Point" as const,
          coordinates: [
            finalLocation.longitude,
            finalLocation.latitude,
          ] as [number, number],
        },
      };


      const organization =
        await createOrganization(payload);


      if (photo) {
        await uploadOrganizationPhoto(
          photo,
          organization.id,
        );
      }


      return organization;
    },


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });


      navigate("/");

    },
  });
  const handleSubmit = (
    e: FormEvent,
  ): void => {

    e.preventDefault();

    setFormError(null);


    if (!name.trim()) {
      setFormError(
        "Organization name is required.",
      );
      return;
    }


    if (!type) {
      setFormError(
        "Organization type is required.",
      );
      return;
    }


    if (!phone.trim()) {
      setFormError(
        "Phone is required.",
      );
      return;
    }


    if (!address.trim()) {
      setFormError(
        "Address is required.",
      );
      return;
    }


    if (!photo) {
      setFormError(
        "An exterior photo is required.",
      );
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
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Become a Help Center
        </h2>

        <p className="text-muted-foreground">
          Register your organization to help animals in your area.
        </p>
      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div className="space-y-2">
          <Label htmlFor="organization-name">
            Organization name *
          </Label>

          <Input
            id="organization-name"
            placeholder="Veterinaria Patitas..."
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
        </div>


        <div className="space-y-2">

          <Label htmlFor="organization-type">
            Type *
          </Label>


          <select
            id="organization-type"
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="
              h-10 w-full rounded-md
              border border-input
              bg-background
              px-3 text-sm
            "
          >

            <option value="">
              Select type
            </option>

            <option value="veterinary">
              Veterinary
            </option>

            <option value="shelter">
              Shelter
            </option>

            <option value="rescue">
              Rescue
            </option>

            <option value="ngo">
              NGO
            </option>

          </select>

        </div>


        <div className="space-y-2">

          <Label htmlFor="phone">
            Phone *
          </Label>

          <Input
            id="phone"
            placeholder="9621234567"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

        </div>


        <div className="space-y-2">

          <Label htmlFor="address">
            Address *
          </Label>

          <Input
            id="address"
            placeholder="Street 123..."
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
          />

        </div>


        <div className="space-y-2">

          <Label htmlFor="description">
            Description
          </Label>

          <Textarea
            id="description"
            rows={4}
            placeholder="Tell us about your organization..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

        </div>


        <PhotoUploader
          photo={photo}
          setPhoto={setPhoto}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          required
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
            : "Submit verification"}
        </Button>


      </form>

    </div>
  );
};