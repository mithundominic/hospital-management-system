// src/routes/encounters.js
// Responsibility: Encounter and prescription API routes

const express = require("express");
const {
  requireHospitalPermission,
} = require("../middleware/requireHospitalPermission");
const { sendData } = require("../utils/respond");
const {
  createPrescription,
} = require("../services/prescriptions/PrescriptionService");

const router = express.Router();

router.get(
  "/hospitals/:hospitalId/encounters",
  requireHospitalPermission("encounters.read"),
  async (req, res, next) => {
    try {
      let query = req.supabase
        .from("encounters")
        .select("*")
        .eq("hospital_id", req.params.hospitalId);
      if (req.query.patient_id)
        query = query.eq("patient_id", req.query.patient_id);
      const { data, error } = await query.order("started_at", {
        ascending: false,
      });
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/hospitals/:hospitalId/encounters",
  requireHospitalPermission("encounters.write"),
  async (req, res, next) => {
    try {
      const {
        patient_id,
        appointment_id,
        doctor_membership_id,
        department_id,
        encounter_type,
        chief_complaint,
        vitals,
      } = req.body;
      const { data, error } = await req.supabase
        .from("encounters")
        .insert({
          hospital_id: req.params.hospitalId,
          patient_id,
          appointment_id,
          doctor_membership_id,
          department_id,
          encounter_type,
          chief_complaint,
          vitals,
        })
        .select()
        .single();
      if (error) throw error;
      sendData(res, data, 201);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  "/hospitals/:hospitalId/encounters/:encId",
  requireHospitalPermission("encounters.write"),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from("encounters")
        .update(req.body)
        .eq("id", req.params.encId)
        .eq("hospital_id", req.params.hospitalId)
        .select()
        .single();
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission("prescriptions.read"),
  async (req, res, next) => {
    try {
      const { data, error } = await req.supabase
        .from("prescriptions")
        .select("*, prescription_items(*)")
        .eq("encounter_id", req.params.encId)
        .eq("hospital_id", req.params.hospitalId);
      if (error) throw error;
      sendData(res, data);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/hospitals/:hospitalId/encounters/:encId/prescriptions",
  requireHospitalPermission("prescriptions.write"),
  async (req, res, next) => {
    try {
      const prescription = await createPrescription(req.supabase, {
        hospital_id: req.params.hospitalId,
        encounter_id: req.params.encId,
        prescribed_by: req.body.prescribed_by,
        notes: req.body.notes,
        items: req.body.items || [],
      });
      sendData(res, prescription, 201);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
