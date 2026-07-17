import type { ReactElement } from "react";
import { useParams } from "react-router-dom";

export const ReportDetail = (): ReactElement => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Report Detail</h1>
      <p>Report ID: {id}</p>
    </div>
  );
};