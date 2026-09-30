// Responsibility: Table displaying patient lab results

import { Table } from "@/components/ui/Table";
import type { PatientLabResult } from "../patientPortal.types";
import { labResultStatusConfig } from "../patientPortal.config";

interface PatientLabResultsTableProps {
  labResults: PatientLabResult[];
}

export const PatientLabResultsTable = ({
  labResults,
}: PatientLabResultsTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Result Value</th>
          <th>Reference Range</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {labResults.map((result) => (
          <tr key={result.id}>
            <td>{result.test_name}</td>
            <td className="font-semibold">{result.result_value}</td>
            <td>{result.reference_range || "N/A"}</td>
            <td>{new Date(result.result_date).toLocaleDateString()}</td>
            <td>
              <span className={labResultStatusConfig[result.status].indicator}>
                {labResultStatusConfig[result.status].label}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
