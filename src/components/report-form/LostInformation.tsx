import type { Dispatch, ReactElement, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LostInformationProps {
  contactPhone: string;
  setContactPhone: Dispatch<SetStateAction<string>>;

  rewardAmount: string;
  setRewardAmount: Dispatch<SetStateAction<string>>;

  radiusMeters: string;
  setRadiusMeters: Dispatch<SetStateAction<string>>;
}

export const LostInformation = ({
  contactPhone,
  setContactPhone,

  rewardAmount,
  setRewardAmount,

  radiusMeters,
  setRadiusMeters,
}: LostInformationProps): ReactElement => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact phone</Label>

        <Input
          id="contactPhone"
          placeholder="+52..."
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rewardAmount">
          Reward amount (USD)
        </Label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            $
          </span>

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
        <Label htmlFor="radiusMeters">
          Search radius: {radiusMeters} m
        </Label>

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
  );
};