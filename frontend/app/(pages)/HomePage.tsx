"use client";

import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { Upload, File, CheckCircle2 } from "lucide-react";
import PrivacyModal from "./components/privacyModal";
import { toast } from "sonner";
import { ShareContent } from "../apis/microservices";
import { useRouter } from "next/navigation";
import axios from "axios";
import SharedItemList from "./components/sharedItemList";
import { SharedItemListRef } from "./components/sharedItemList";
import ShareFileDetailsModal from "./components/shareFileDetails";
import { handleGenerateOTP } from "@/lib/generateOTP";

const HomePage = () => {
  const router = useRouter();

  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedPrivacyOption, setSelectedPrivacyOption] =
    useState<string>("public");
  const [uniqueURL, setUniqueURL] = useState<string | null>(null);
  const [rendomOTP, setRendomOTP] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isOpenPrivacyModal, setIsOpenPrivacyModal] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [userCode, setUserCode] = useState<string | null>(null);
  const [openFileDetailsModal, setOpenFileDetailsModal] =
    useState<boolean>(false);
  const sharedItemListRef = useRef<SharedItemListRef>(null);

  const handleFileUploadEvent = () => {
    fileUploadRef.current?.click();
  };

  const handleDragOverEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeaveEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDropEvent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSetAttributes = () => {
    const newUUID = crypto.randomUUID();
    setUniqueURL(newUUID);
    const otp = handleGenerateOTP();
    setRendomOTP(otp);
    setIsOpenPrivacyModal(true);
  };

  const uploadToCloudinary = async (
    file: File,
    privacyType: string,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<{ url: string; publicId: string }> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const chunkSize = 6 * 1024 * 1024; // 6MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    const uniqueUploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const publicId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    let finalResponse;

    for (let i = 0; i < totalChunks; i++) {
      // Abort if the user canceled the upload
      if (signal?.aborted) {
        throw new Error("Upload canceled");
      }

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", `fileshare/${privacyType}`);
      formData.append("public_id", publicId);
      formData.append("resource_type", "auto");
      formData.append("flags", "attachment");

      try {
        finalResponse = await axios.post(url, formData, {
          signal,
          headers: {
            "X-Unique-Upload-Id": uniqueUploadId,
            "Content-Range": `bytes ${start}-${end - 1}/${file.size}`,
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.loaded) {
              const chunkLoaded = progressEvent.loaded;
              const totalLoadedSoFar = start + chunkLoaded;
              const percent = Math.round((totalLoadedSoFar * 100) / file.size);
              onProgress(Math.min(percent, 100));
            }
          },
        });
      } catch (error) {
        console.error(`Error uploading chunk ${i}:`, error);
        throw error; 
      }
    }

    return {
      url: finalResponse?.data.secure_url,
      publicId: finalResponse?.data.public_id,
    };
  };

  const handleSubmit = async () => {
    setIsOpenPrivacyModal(false);
    setLoading(true);
    setUploadProgress(0);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const file = uploadedFile as File;

      // Step 1: Upload directly to Cloudinary from frontend
      const { url: fileUrl, publicId } = await uploadToCloudinary(
        file,
        selectedPrivacyOption,
        (percent) => setUploadProgress(percent),
        controller.signal,
      );

      // Step 2: Send only metadata to your backend
      await ShareContent({
        privacyType: selectedPrivacyOption,
        otp: selectedPrivacyOption !== "public" ? rendomOTP || "" : undefined,
        contentUrl: uniqueURL || "",
        uniqueUserCode: userCode || "",
        fileUrl,
        publicId,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      setOpenFileDetailsModal(true);
      setUploadedFile(null);

      // Optimistically add the new item to the shared list
      sharedItemListRef.current?.addItem({
        file: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileType: file.type,
        size: file.size,
        privacyType: selectedPrivacyOption as "public" | "private",
        contentUrl: uniqueURL || "",
        createdAt: new Date().toISOString(),
        password: selectedPrivacyOption === "private" ? rendomOTP : undefined,
      });

      toast.success("File uploaded successfully!");
    } catch (error: any) {
      if (axios.isCancel(error)) {
        toast.info("Upload canceled");
      } else {
        console.log(error);
        toast.error("Please Try again.");
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  return (
    <>
      <div className="relative h-[calc(100vh-80px)] overflow-hidden bg-background selection:bg-primary/20">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-125 w-125 bg-primary/5 blur-[100px] rounded-full animate-pulse opacity-50" />
        </div>

        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 py-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Upload.{" "}
              <span className="bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Share.
              </span>{" "}
              Collaborate.
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
              Securely share your files with friends and colleagues. Simple,
              fast, and encrypted.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <div
              className={`
              relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed 
              transition-all duration-300 ease-in-out
              ${
                isDragging
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10 scale-[1.01]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30 bg-card/50"
              }
            `}
              onDragOver={handleDragOverEvent}
              onDragLeave={handleDragLeaveEvent}
              onDrop={isLoading ? undefined : handleDropEvent}
              onClick={
                !uploadedFile && !isLoading ? handleFileUploadEvent : undefined
              }
            >
              <input
                type="file"
                className="hidden"
                ref={fileUploadRef}
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              />

              <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 min-h-80">
                {isLoading ? (
                  <div className="w-full max-w-sm space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Upload className="h-8 w-8 animate-bounce" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Uploading...
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis px-4">
                        {uploadedFile?.name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          abortController?.abort();
                        }}
                        className="w-full text-destructive border-transparent hover:bg-destructive/10 hover:border-destructive/30 transition-all font-medium"
                      >
                        Stop Uploading
                      </Button>
                    </div>
                  </div>
                ) : uploadedFile ? (
                  <div className="w-full animate-in fade-in zoom-in duration-300">
                    <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                      <File className="h-12 w-12" />
                      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background ring-4 ring-background text-green-500 shadow-sm">
                        <CheckCircle2 className="h-full w-full fill-current" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold break-all line-clamp-1 px-4 text-foreground">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                    <div className="mt-8 flex justify-center gap-4">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        variant="ghost"
                        className="px-8 cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        size="lg"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSetAttributes}>
                        Upload
                        <Upload className="ml-2 h-4 w-4" />
                      </Button>
                      <PrivacyModal
                        uniqueURL={uniqueURL}
                        rendomOTP={rendomOTP}
                        selectedPrivacyOption={selectedPrivacyOption}
                        setSelectedPrivacyOption={setSelectedPrivacyOption}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        isOpenPrivacyModal={isOpenPrivacyModal}
                        setIsOpenPrivacyModal={setIsOpenPrivacyModal}
                      />
                    </div>
                  </div>
                ) : (
                  // Empty State
                  <div className="space-y-6 pointer-events-none">
                    <div
                      className={`
                    mx-auto flex h-20 w-20 items-center justify-center rounded-full 
                    bg-muted/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary
                    ${
                      isDragging
                        ? "scale-110 bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }
                  `}
                    >
                      <Upload className="h-10 w-10 transition-transform duration-300 group-hover:-translate-y-1" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-foreground">
                        {isDragging
                          ? "Drop your file here"
                          : "Drag & drop your file here"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse from your computer
                      </p>
                    </div>
                    <div className="pt-4">
                      <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        Supports: Any File Type
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* {!uploadedFile && !isLoading && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={handleFileUploadEvent}
                  size="lg"
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto min-w-50 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary hover:text-primary transition-all shadow-sm"
                >
                  Browse Files
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <SharedItemList ref={sharedItemListRef} setUserCode={setUserCode} />
      <ShareFileDetailsModal
        uniqueURL={uniqueURL || ""}
        selectedPrivacyOption={selectedPrivacyOption}
        rendomOTP={rendomOTP}
        openFileDetailsModal={openFileDetailsModal}
        setOpenFileDetailsModal={setOpenFileDetailsModal}
      />
    </>
  );
};

export default HomePage;
