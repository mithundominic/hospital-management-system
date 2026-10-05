// Responsibility: Table displaying patient lab results in table or cards view using reusable DataTable
import { TestTube } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { Text } from "@/components/ui/Text";
import { DataTable } from "@/components/common/DataTable";
import { PatientLabResultCard } from "./PatientLabResultCard";
import type { PatientLabResult } from "../patientPortal.types";
import { labResultStatusConfig } from "../patientPortal.config";

const LAB_RESULT_COLUMNS = [
  { key: "test_name", header: "Test Name" },
  { key: "result_value", header: "Result Value" },
  { key: "reference_range", header: "Reference Range" },
  { key: "result_date", header: "Date" },
  { key: "status", header: "Status" },
] as const;

interface PatientLabResultsTableProps {
  labResults: PatientLabResult[];
}

export const PatientLabResultsTable = ({
  labResults,
}: PatientLabResultsTableProps) => (
  <DataTable
    columns={LAB_RESULT_COLUMNS}
    data={labResults}
    showViewToggle={true}
    emptyIcon={TestTube}
    emptyTitle="No lab results available"
    emptyDescription="Your laboratory test results will appear here once processed."
    containerClassName="max-h-[460px] overflow-auto"
    renderRow={(result) => (
      <TableRow key={result.id}>
        <TableCell>{result.test_name}</TableCell>
        <TableCell className="font-semibold">{result.result_value}</TableCell>
        <TableCell>{result.reference_range || "N/A"}</TableCell>
        <TableCell>{new Date(result.result_date).toLocaleDateString()}</TableCell>
        <TableCell>
          <Text
            as="span"
            className={labResultStatusConfig[result.status].indicator}
          >
            {labResultStatusConfig[result.status].label}
          </Text>
        </TableCell>
      </TableRow>
    )}
    renderCard={(result) => (
      <PatientLabResultCard key={result.id} result={result} />
    )}
  />
);

export default PatientLabResultsTable;
