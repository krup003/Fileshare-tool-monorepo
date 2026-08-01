"use client";


import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  deleteSharedContent,
  getSharedContentList,
} from "@/app/apis/microservices";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  FileText,
  Image as ImageIcon,
  Lock,
  Globe,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Key,
  Trash,
} from "lucide-react";
import { generateRandomTenDigitNumber } from "@/lib/utils";
import { toast } from "sonner";
import { Heart, Github, Linkedin } from "lucide-react";
import ShareFileDetailsModal from "../shareFileDetails";
import { SpinnerCustom } from "@/components/ui/spinner";

interface SharedItemListProps {
  setUserCode: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface SharedItemListRef {
  addItem: (item: SharedItem) => void;
}

interface SharedItem {
  file: string;
  originalName?: string;
  mimeType?: string;
  fileType?: string;
  type?: string; // Added based on your JSON response
  size?: number;
  privacyType: "public" | "private";
  contentUrl: string;
  createdAt?: string;
  time?: string; // Added based on your JSON response
  password?: number | string;
}

const SharedItemList = forwardRef<SharedItemListRef, SharedItemListProps>(({ setUserCode }, ref) => {
  const [sharedContentList, setSharedContentList] = useState<SharedItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFileDetailsModal, setOpenFileDetailsModal] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SharedItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    addItem: (item: SharedItem) => {
      setSharedContentList((prev) => [item, ...prev]);
    },
  }));

  const fetchShareContentList = async (storedCode: string) => {
    try {
      const response = await getSharedContentList(storedCode || "");
      const items = response.finalSharedItems || response;
      setSharedContentList(items);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    let storedCode = localStorage.getItem("uniqueUserCode");

    if (!storedCode) {
      storedCode = generateRandomTenDigitNumber().toString();
      localStorage.setItem("uniqueUserCode", storedCode);
    }

    setUserCode(storedCode.toString());
    fetchShareContentList(storedCode);
  }, [setUserCode]);

  const handleCopy = (contentUrl: string, label: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${base}/shared-file/${contentUrl}`;

    navigator.clipboard.writeText(fullUrl);
    setCopiedId(contentUrl);
    toast.success(`${label} Link copied!`, {
      description: "URL is ready to share.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (uniqueId: string) => {
    setDeletingId(uniqueId);
    try {
      await deleteSharedContent(uniqueId);
      toast.success("Item deleted successfully");
      setSharedContentList((prevItems) =>
        prevItems.filter((item) => item.contentUrl !== uniqueId), 
      );
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  console.log("selectedItem", selectedItem);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shared Items <span className="text-slate-400 font-light">List</span>
          </h1>
          <p className="text-sm text-slate-500">
            View and manage your shared links and passwords.
          </p>
        </div>
      </header>

      <div className="grid gap-4" id="shared-list-content">
        {sharedContentList.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl border-slate-100">
            <p className="text-slate-400 italic">
              Your list is currently empty.
            </p>
          </div>
        ) : (
          sharedContentList.map((item, index) => (
            <Card
              key={index}
              onClick={() => {
                setOpenFileDetailsModal(true);
                setSelectedItem(item);
              }}
              className="cursor-pointer py-0 overflow-hidden border-slate-200 transition-all hover:border-slate-300 shadow-sm"
            >
              <div className="p-3 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="h-9 w-9 sm:h-12 sm:w-12 shrink-0 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                      {(item.fileType || item.type)?.includes("image") ? (
                        <ImageIcon className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
                      ) : (
                        <FileText className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 min-w-0">
                        <span className="font-semibold text-xs sm:text-sm truncate text-slate-900">
                          {item.file || item.originalName || "Untitled File"}
                        </span>
                        <Badge
                          variant={
                            item.privacyType === "private"
                              ? "secondary"
                              : "outline"
                          }
                          className={`text-[10px] uppercase tracking-wider h-5 px-1.5 shrink-0 ${
                            item.privacyType === "private"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : ""
                          }`}
                        >
                          {item.privacyType === "private" ? (
                            <Lock size={10} className="mr-0.5 sm:mr-1" />
                          ) : (
                            <Globe size={10} className="mr-0.5 sm:mr-1" />
                          )}
                          <span className="hidden sm:inline">{item.privacyType}</span>
                        </Badge>
                      </div>

                      {/* Updated: Added Date next to URL */}
                      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400">
                        {/* <span className="font-mono truncate max-w-[200px]">
                          {item.contentUrl}
                        </span> */}
                        {(item.time || item.createdAt) && (
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar size={11} className="sm:h-3 sm:w-3" />
                            {formatDate(item.time || item.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 gap-2 shrink-0 border-slate-200 hover:bg-slate-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.contentUrl, "Link");
                      }}
                    >
                      {copiedId === item.contentUrl ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </Button>
                    {deletingId === item.contentUrl ? (
                      <Button variant={"outline"} className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3" disabled>
                        <SpinnerCustom />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-auto p-0 sm:px-3 gap-2 shrink-0 border-red-200 hover:bg-slate-50"
                        onClick={(e) => {
                          // setSelectedItem(item);
                          e.stopPropagation();
                          handleDelete(item.contentUrl);
                        }}
                      >
                        <Trash className="text-red-600 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        {/* Left / Center Text */}
        <p className="flex items-center gap-1 text-[11px] text-slate-400">
          © 2026 Made with{" "}
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />  by KRUP
        </p>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/krup003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-black transition"
          >
            <Github className="h-4 w-4" />
          </a>

          <a
            href="https://www.linkedin.com/in/krup-kantesariya-7851b625a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-blue-600 transition"
          >
            <Linkedin className="h-4 w-4" />
          </a>

          <a
            href="https://krupkantesariya-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-emerald-600 transition"
          >
            <Globe className="h-4 w-4" />
          </a>
        </div>
      </footer>
      <ShareFileDetailsModal
        uniqueURL={selectedItem?.contentUrl || ""}
        selectedPrivacyOption={selectedItem?.privacyType || "public"}
        rendomOTP={selectedItem?.password?.toString() || ""}
        openFileDetailsModal={openFileDetailsModal}
        setOpenFileDetailsModal={setOpenFileDetailsModal}
      />
    </div>
  );
});

SharedItemList.displayName = "SharedItemList";

export default SharedItemList;
