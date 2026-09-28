// src/routes/staff.js -- matches API_SPEC.md "### Doctors & departments"

const express = require('express');
const { requireHospitalPermission } = require('../middleware/requireHospitalPermission');
const { sendData } = require('../utils/respond');

const router = express.Router();

router.get(
  '/hospitals/:hospitalId/doctors',
  requireHospitalPermission('doctors.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('doctor_profiles')
        .select('*, memberships!inner(hospital_id, user_id)')
        .eq('memberships.hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

// Requires an existing membership with role = Doctor at this hospital
// (membership_id) -- this endpoint adds the doctor-specific profile fields
// on top of it, it doesn't create the membership itself (see memberships.js).
router.post(
  '/hospitals/:hospitalId/doctors',
  requireHospitalPermission('doctors.write'),
  async (req, res, next) => {
    try {
      const { membership_id, department_id, specialization, registration_number, qualifications, consultation_fee } = req.body;
      const { data, error } = await req.supabase
        .from('doctor_profiles')
        .insert({ membership_id, department_id, specialization, registration_number, qualifications, consultation_fee })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  '/hospitals/:hospitalId/doctors/:doctorId',
  requireHospitalPermission('doctors.write'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('doctor_profiles')
        .update(req.body)
        .eq('id', req.params.doctorId)
        .select()
        .single();
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/hospitals/:hospitalId/departments',
  requireHospitalPermission('departments.read'),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from('departments')
        .select('*')
        .eq('hospital_id', req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/hospitals/:hospitalId/departments',
  requireHospitalPermission('departments.write'),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data, error } = await req.supabase
        .from('departments')
        .insert({ hospital_id: req.params.hospitalId, name })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
