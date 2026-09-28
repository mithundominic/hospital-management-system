// backend/src/routes/patients.ts
// Responsibility: Patient management API routes

import { Router } from 'express';
import { requireHospitalPermission } from '../middleware/requireHospitalPermission';
import { sendData, sendError } from '../utils/respond';
import { AuthenticatedRequest, RouteHandler } from '../types';

const router = Router();

const getPatients: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from('patient_registrations')
      .select('hospital_patient_number, registered_at, patients(*)')
      .eq('hospital_id', authReq.params.hospitalId);
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const getPatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from('patients')
      .select('*, patient_registrations(*)')
      .eq('id', authReq.params.patientId)
      .single();
    if (error) {
      sendError(res, 404, 'NOT_FOUND', 'Patient not found or not visible to you');
      return;
    }
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

const createPatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { full_name, dob, gender, phone, email, blood_group, hospital_patient_number } = authReq.body;

    const { data: patient, error: patientError } = await authReq.supabase
      .from('patients')
      .insert({ full_name, dob, gender, phone, email, blood_group })
      .select()
      .single();
    if (patientError) throw patientError;

    const { data: registration, error: regError } = await authReq.supabase
      .from('patient_registrations')
      .insert({
        patient_id: patient.id,
        hospital_id: authReq.params.hospitalId,
        hospital_patient_number,
      })
      .select()
      .single();
    if (regError) throw regError;

    sendData(res, { ...patient, registration }, 201);
  } catch (err) {
    next(err);
  }
};

const updatePatient: RouteHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { data, error } = await authReq.supabase
      .from('patients')
      .update(authReq.body)
      .eq('id', authReq.params.patientId)
      .select()
      .single();
    if (error) throw error;
    sendData(res, data);
  } catch (err) {
    next(err);
  }
};

router.get('/hospitals/:hospitalId/patients', requireHospitalPermission('patients.read'), getPatients);
router.get('/hospitals/:hospitalId/patients/:patientId', requireHospitalPermission('patients.read'), getPatient);
router.post('/hospitals/:hospitalId/patients', requireHospitalPermission('patients.write'), createPatient);
router.patch('/hospitals/:hospitalId/patients/:patientId', requireHospitalPermission('patients.write'), updatePatient);

export default router;
