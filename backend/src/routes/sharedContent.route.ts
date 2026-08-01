import express from "express";
import {
  changePrivacyTypes,
  deleteSharedContent,
  downloadFile,
  getSharedContent,
  getSharedItemList,
  SendViaEmail,
  SharedContentController,
  verifyOTP,
} from "../controllers/sharedContent.controller";
// import { upload } from "../config/multer";

const router = express.Router();

// router.post("/share", upload.single("file"), SharedContentController);
router.post("/share", SharedContentController);
router.get("/getSharedContent/:id", getSharedContent);
router.post("/otpVerify", verifyOTP);
router.post("/download", downloadFile);
router.get("/getSharedItemList/:id", getSharedItemList);
router.post("/updatePrivacyTypes", changePrivacyTypes);
router.delete("/deleteFile/:id", deleteSharedContent);
router.post("/sendEmail", SendViaEmail);

export default router;
