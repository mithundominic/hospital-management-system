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
} from "./abdmCallbacks.handlers";

const router = Router();

// Mount JWT signature verification middleware for all callback routes
router.use(verifyAbdmCallback);

// M1: Result of initiateAbhaVerification()
router.post(API_ROUTES.callbacks.authOnInit, handleAuthOnInit);

// M1: Result of confirmAbhaLink()
router.post(API_ROUTES.callbacks.authOnConfirm, handleAuthOnConfirm);

// M2: Result of linkCareContext()
router.post(API_ROUTES.callbacks.linkOnInit, handleLinkOnInit);

// M3: Result of requestConsent()
router.post(API_ROUTES.callbacks.consentOnInit, handleConsentOnInit);

// M3: Patient granted/denied consent via Consent Manager app
router.post(API_ROUTES.callbacks.hiuNotify, handleHiuNotify);

export default router;
