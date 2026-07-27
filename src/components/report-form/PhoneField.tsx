import { useState, type ReactElement } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const COUNTRY_CODES = [
  { code: "+52", label: "MX" },
  { code: "+1", label: "US/CA" },
  { code: "+51", label: "PE" },
  { code: "+54", label: "AR" },
  { code: "+57", label: "CO" },
  { code: "+56", label: "CL" },
  { code: "+34", label: "ES" },
  { code: "+55", label: "BR" },
  { code: "+593", label: "EC" },
  { code: "+58", label: "VE" },
];

export const isPhoneFilled = (value: string): boolean => {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code));
  return Boolean(match && value.length > match.code.length);
};

export const isValidPhone = (value: string): boolean => {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code));
  if (!match) return false;
  const rest = value.slice(match.code.length);
  return /^\d{6,12}$/.test(rest);
};

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneField = ({ value, onChange }: PhoneFieldProps): ReactElement => {
  const initialCode = COUNTRY_CODES.find((c) => value.startsWith(c.code))?.code ?? "+52";
  const [code, setCode] = useState(initialCode);
  const [number, setNumber] = useState(
    value.startsWith(initialCode) ? value.slice(initialCode.length) : ""
  );

  const handleCodeChange = (newCode: string): void => {
    setCode(newCode);
    onChange(`${newCode}${number}`);
  };

  const handleNumberChange = (raw: string): void => {
    const digitsOnly = raw.replace(/\D/g, "");
    setNumber(digitsOnly);
    onChange(`${code}${digitsOnly}`);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="contactPhone">Contact phone</Label>
      <div className="flex gap-2">
        <select
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="w-24 rounded-md border border-input bg-background px-2 text-sm"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} {c.label}
            </option>
          ))}
        </select>
        <Input
          id="contactPhone"
          value={number}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder="9991234567"
        />
      </div>
    </div>
  );
};