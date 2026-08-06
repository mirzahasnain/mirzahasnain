"use client";

import { NumberField } from "@/components/news-bias/NumberField";
import { FIELD_COPY } from "@/lib/news-bias/constants";

export interface ReleaseInputValues {
  forecast: string;
  previous: string;
  actual: string;
}

interface ReleaseInputsProps {
  values: ReleaseInputValues;
  onChange: (values: ReleaseInputValues) => void;
  actualReadOnly?: boolean;
}

export function ReleaseInputs({
  values,
  onChange,
  actualReadOnly = false,
}: ReleaseInputsProps) {
  const update = (field: keyof ReleaseInputValues) => (value: string) =>
    onChange({ ...values, [field]: value });

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <NumberField
        label={FIELD_COPY.forecast.label}
        placeholder={FIELD_COPY.forecast.placeholder}
        value={values.forecast}
        onChange={update("forecast")}
      />
      <NumberField
        label={FIELD_COPY.previous.label}
        placeholder={FIELD_COPY.previous.placeholder}
        value={values.previous}
        onChange={update("previous")}
      />
      <NumberField
        label={FIELD_COPY.actual.label}
        placeholder={FIELD_COPY.actual.placeholder}
        value={values.actual}
        onChange={update("actual")}
        readOnly={actualReadOnly}
      />
    </div>
  );
}
