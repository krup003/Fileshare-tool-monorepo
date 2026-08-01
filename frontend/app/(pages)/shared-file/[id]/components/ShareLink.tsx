"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  FileIcon,
  Download,
  Cloud,
  UploadCloud,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { downloadContent, getSharedData } from "@/app/apis/microservices";
import { SpinnerCustom } from "@/components/ui/spinner";
import OTPModal from "./OTPModal";
import { useRouter } from "next/navigation";

interface DownloadContentDataTypes {
  file: {
    file: string;
    originalName: string;
    mimeType: string;
    fileType: string;
    size: number;
  };
  privacyType: string;
  contentUrl: string;
  createdAt: string;
}

const formatBytes = (bytes?: number) => {
  if (bytes === undefined) return "Unknown size";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  if (bytes < k * k) {
    return (bytes / k).toFixed(2) + " KB";
  }
  return (bytes / (k * k)).toFixed(2) + " MB";
};

const DownloadPageClient = ({ id }: { id: string }) => {
  const router = useRouter();

  const [origin, setOrigin] = useState("");
  const [fileData, setFileData] = useState<DownloadContentDataTypes>();
  const [isLoading, setIsloading] = useState(true);
  const [isOpenOTPModal, setIsOpenOTPModel] = useState(false);
  const [isOTPVerify, setIsOTPVerify] = useState(false);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fullUrl = origin ? `${origin}/shared-file/${id}` : "";
  let formattedDate = "Calculating...";

  const handleCopy = () => {
    setIsCopied(true);
    if (fullUrl) {
      navigator.clipboard.writeText(fullUrl);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const fetchData = async () => {
    setIsloading(true);
    try {
      const response = await getSharedData(id);
      setFileData(response.sharedContent);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    fetchData();
    if (fileData?.privacyType == "private" && !isOTPVerify) {
      setIsOpenOTPModel(true);
    }
  }, []);

  if (fileData?.createdAt) {
    const expiryDate = new Date(fileData.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 7);
    formattedDate = expiryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    if (fileData?.privacyType == "private" && !isOTPVerify) {
      setIsOpenOTPModel(true);
    }
  }, [fileData]);

  const DownloadFile = async (
    overrideOTPVerify?: boolean | React.MouseEvent,
  ) => {
    const payload = { sharedURL: id };
    const isVerified =
      typeof overrideOTPVerify === "boolean" ? overrideOTPVerify : isOTPVerify;

    if (fileData?.privacyType === "private" && !isVerified) {
      setIsOpenOTPModel(true);
      return;
    }

    setIsLoadingDownload(true);
    try {
      // Step 1: Get the Blob and Headers directly from your backend proxy
      const { blob, headers } = await downloadContent(payload);

      // Step 2: Extract the original filename from the Content-Disposition header
      const contentDisposition = headers["content-disposition"];
      let originalName = "download"; // Fallback name

      if (contentDisposition && contentDisposition.includes("filename=")) {
        originalName = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, ""); // Remove quotes around the filename
      }

      // Step 3: Trigger the download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      setIsOTPVerify(false);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Could not download file. Please check your network.");
    } finally {
      setIsLoadingDownload(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
        <div className="scale-150">
          <SpinnerCustom />
        </div>
        <p className="mt-8 text-sm text-muted-foreground animate-pulse">
          Loading secure file details...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
              <Cloud className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold leading-none tracking-tight">
                Ready to download
              </h3>
              <p className="text-sm text-muted-foreground">
                File is ready for secure transfer
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 pt-0 grid gap-4">
          {/* File Details */}
          <div className="flex items-center gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 bg-muted/50 min-w-0 overflow-hidden">
            <div className="rounded-md bg-background p-2 border shrink-0">
              <FileIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </div>
            <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">
                {fileData?.file.originalName || "Unknown File"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="shrink-0">
                  {formatBytes(fileData?.file.size)}
                </span>
                <span className="shrink-0">•</span>
                <span className="truncate">{fileData?.file.mimeType}</span>
              </div>
            </div>
          </div>

          {/* Share Link & Expiry */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="download-link"
                className="text-xs text-muted-foreground"
              >
                Share this download link
              </Label>
              <div className="flex items-center gap-2 min-w-0">
                <input
                  id="download-link"
                  readOnly
                  value={fullUrl}
                  className="flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-xs sm:text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 truncate"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 cursor-pointer"
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* <div className="flex items-center justify-center gap-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0"></span>
              <span className="truncate">Link expires in 7 days ({formattedDate})</span>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full flex-col sm:flex-row justify-evenly gap-2">
            <Button
              className="w-full sm:w-1/2 cursor-pointer"
              size="lg"
              onClick={() => router.push("/")}
              variant={"outline"}
              disabled={isLoadingDownload}
            >
              <UploadCloud className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">Upload More</span>
            </Button>
            <Button
              className="w-full sm:w-1/2 cursor-pointer"
              size="lg"
              onClick={DownloadFile}
              disabled={isLoadingDownload}
            >
              <Download className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">Download File</span>
              {isLoadingDownload && <SpinnerCustom />}
            </Button>
          </div>

          <div className="text-center w-full px-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider break-all">
              Reference ID: <span className="font-mono">{id}</span>
            </p>
          </div>
        </div>
      </div>
      <OTPModal
        uniqueId={id}
        isOpenOTPModal={isOpenOTPModal}
        setIsOpenOTPModel={setIsOpenOTPModel}
        setIsOTPVerify={setIsOTPVerify}
        DownloadFile={DownloadFile}
      />
    </div>
  );
};

export default DownloadPageClient;
