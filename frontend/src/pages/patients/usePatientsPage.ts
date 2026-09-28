// Responsibility: Manage patients listing state, query fetching, and search filtering

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHospital } from "@/contexts/HospitalContext";
import { api } from "@/lib/api";
import { QUERY_KEYS, API_ROUTES } from "@/constants";
import type { Patient } from "@/types";

interface PatientRecordItem {
  patients: Patient;
  hospital_patient_number: string;
}

export const usePatientsPage = () => {
  const { currentHospital } = useHospital();
  const [searchTerm, setSearchTerm] = useState("");
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
      return await api.get<PatientRecordItem[]>(
        API_ROUTES.hospitals.patients(currentHospital.id),
      );
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
          p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.hospital_patient_number
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          p.phone?.includes(searchTerm),
      ),
    [patients, searchTerm],
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
