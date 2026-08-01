import AxiosInstance from "../axiosInstance";
import { AxiosRequestConfig } from "axios";

export const ShareContent = async (data: {
  privacyType: string;
  otp?: string;
  contentUrl: string;
  uniqueUserCode: string;
  fileUrl: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}) => {
  try {
    const res = await AxiosInstance.post("/api/share", data);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSharedData = async (id: string) => {
  try {
    const res = await AxiosInstance.get(`/api/getSharedContent/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const verifyOTP = async (payload: { otp: string; uniqueId: string }) => {
  try {
    const res = await AxiosInstance.post("/api/otpVerify", payload);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const downloadContent = async (payload: { sharedURL: string }) => {
  try {
    const res = await AxiosInstance.post("/api/download", payload, {
      responseType: "blob",
    });
    return {
      blob: res.data,
      headers: res.headers,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSharedContentList = async (id: string) => {
  try {
    const res = await AxiosInstance.get(`/api/getSharedItemList/${id}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const changePrivacyTypes = async (payload: {
  updatedPrivacyTypes: string;
  uniqueURL: string;
  otp: number | null;
}) => {
  try {
    const res = await AxiosInstance.post("/api/updatePrivacyTypes", payload);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteSharedContent = async (uniqueURL: string) => {
  try {
    const res = await AxiosInstance.delete(`/api/deleteFile/${uniqueURL}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const sendViaEmail = async (payload: {
  sharedURL: string;
  email: string;
}) => {
  try {
    const res = await AxiosInstance.post("/api/sendEmail", payload);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
