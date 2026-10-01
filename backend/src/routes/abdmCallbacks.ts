// Responsibility: Inbound ABDM gateway callbacks router (NO user auth)

import { Router } from "express";
import { API_ROUTES } from "../constants";
import { verifyAbdmCallback } from "../middleware/verifyAbdmCallback";
import {
  handleAuthOnInit,
  handleAuthOnConfirm,
  handleLinkOnInit,
  handleConsentOnInit,
  handleHiuNotify,
  handleHipDataRequest,
} from "./abdmCallbacks.handlers";

const router = Router();

// M1: Result of initiateAbhaVerification()
router.post(API_ROUTES.callbacks.authOnInit, verifyAbdmCallback, handleAuthOnInit);

// M1: Result of confirmAbhaLink()
router.post(API_ROUTES.callbacks.authOnConfirm, verifyAbdmCallback, handleAuthOnConfirm);

// M2: Result of linkCareContext()
router.post(API_ROUTES.callbacks.linkOnInit, verifyAbdmCallback, handleLinkOnInit);

// M3: Result of requestConsent()
router.post(API_ROUTES.callbacks.consentOnInit, verifyAbdmCallback, handleConsentOnInit);

// M3: Patient granted/denied consent via Consent Manager app
router.post(API_ROUTES.callbacks.hiuNotify, verifyAbdmCallback, handleHiuNotify);

// M2: HIU requests patient health data after consent granted
router.post(API_ROUTES.callbacks.hipDataRequest, verifyAbdmCallback, handleHipDataRequest);

export default router;
