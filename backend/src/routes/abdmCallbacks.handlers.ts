// Responsibility: Handler logic delegating inbound ABDM callbacks to callback service

import { Request, Response } from "express";
import {
  processAuthOnInit,
  processAuthOnConfirm,
  processLinkOnInit,
  processConsentOnInit,
  processHiuNotify,
  processHipDataRequest,
} from "../services/abdm/AbdmCallbackService";

export const handleAuthOnInit = async (req: Request, res: Response) => {
  await processAuthOnInit(req.body);
  res.status(202).json({ received: true });
};

export const handleAuthOnConfirm = async (req: Request, res: Response) => {
  await processAuthOnConfirm(req.body);
  res.status(202).json({ received: true });
};

export const handleLinkOnInit = async (req: Request, res: Response) => {
  await processLinkOnInit(req.body);
  res.status(202).json({ received: true });
};

export const handleConsentOnInit = async (req: Request, res: Response) => {
  await processConsentOnInit(req.body);
  res.status(202).json({ received: true });
};

export const handleHiuNotify = async (req: Request, res: Response) => {
  await processHiuNotify(req.body);
  res.status(202).json({ received: true });
};

export const handleHipDataRequest = async (req: Request, res: Response) => {
  await processHipDataRequest(req.body);
  res.status(202).json({ received: true });
};
