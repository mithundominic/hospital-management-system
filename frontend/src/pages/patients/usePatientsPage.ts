// Responsibility: Manage patients listing state, query fetching, and search filtering

import { useState, useMemo, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/useHospital";
import {
  getHospitalPatients,
  type PatientRecordItem,
} from "@/services/patient.service";
import { QUERY_KEYS } from "@/constants";
import type { Patient } from "@/types";

export const usePatientsPage = () => {
  const { currentHospital } = useHospital();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const {
    data: rawPatients = [],
    isLoading,
    refetch,
  } = useQuery<PatientRecordItem[]>({
    queryKey: QUERY_KEYS.hospitals.patients(currentHospital?.id),
    queryFn: async () => {
      if (!currentHospital) return [];
      return await getHospitalPatients(currentHospital.id);
    },
    enabled: !!currentHospital,
  });

  const patients = useMemo(
    () =>
      rawPatients.map((item) => ({
        ...item.patients,
        hospital_patient_number: item.hospital_patient_number,
      })),
    [rawPatients],
  );

  const filteredPatients = useMemo(
    () =>
      patients.filter(
        (p) =>
          p.full_name?.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
          p.hospital_patient_number
            ?.toLowerCase()
            .includes(deferredSearchTerm.toLowerCase()) ||
          p.phone?.includes(deferredSearchTerm),
      ),
    [patients, deferredSearchTerm],
  );

  return {
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    editingPatient,
    setEditingPatient,
    filteredPatients,
    isLoading,
    refetch,
  } as const;
};
