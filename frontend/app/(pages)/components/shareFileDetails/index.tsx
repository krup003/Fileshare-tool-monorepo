import {
  changePrivacyTypes,
  getSharedData,
  sendViaEmail,
} from "@/app/apis/microservices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Check, Lock, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/ui/spinner";
import { handleGenerateOTP } from "@/lib/generateOTP";

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

interface ShareFileDetailsModalProps {
  setOpenFileDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  openFileDetailsModal: boolean;
  uniqueURL: string;
  rendomOTP: string;
  selectedPrivacyOption: string;
}

const ShareFileDetailsModal = ({
  uniqueURL,
  setOpenFileDetailsModal,
  openFileDetailsModal,
  selectedPrivacyOption,
  rendomOTP,
}: ShareFileDetailsModalProps) => {
  const [fileData, setFileData] = useState<DownloadContentDataTypes>();
  const [hasCopied, setHasCopied] = useState(false);
  const [hasCopiedOTP, setHasCopiedOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [editedPrivacyOption, setEditedPrivacyOption] = useState(
    selectedPrivacyOption,
  );
  const [isChangingPrivacyType, setIsChangingPrivacyType] = useState(false);
  const [newGeneratedOTP, setNewGeneratedOTP] = useState<number | null>(
    Number(rendomOTP),
  );
  const [isSendingEmail, setSendingEmail] = useState(false);

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/shared-file/${uniqueURL}`
      : `http://localhost:3000/shared-file/${uniqueURL}`;

  const handleFetchData = async () => {
    try {
      const res = await getSharedData(uniqueURL);
      setFileData(res.sharedContent);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (openFileDetailsModal) {
      handleFetchData();
      setEditedPrivacyOption(selectedPrivacyOption);
      setNewGeneratedOTP(rendomOTP ? Number(rendomOTP) : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openFileDetailsModal, selectedPrivacyOption, rendomOTP]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleCopyOTP = () => {
    if (newGeneratedOTP) {
      navigator.clipboard.writeText(newGeneratedOTP.toString());
      setHasCopiedOTP(true);
      setTimeout(() => setHasCopiedOTP(false), 2000);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePrivacyOptionEdit = async (newPrivacyValue: string) => {
    setIsChangingPrivacyType(true);
    let otpToSend = null;
    if (newPrivacyValue === "private") {
      otpToSend = handleGenerateOTP();
    }

    try {
      const payload = {
        updatedPrivacyTypes: newPrivacyValue,
        uniqueURL: uniqueURL,
        otp: otpToSend ? Number(otpToSend) : null,
      };
      await changePrivacyTypes(payload);
      if (newPrivacyValue === "private") {
        setNewGeneratedOTP(Number(otpToSend));
      } else {
        setNewGeneratedOTP(null);
      }
    } catch (error) {
      toast.error("Please try again");
      console.error(error);
      setEditedPrivacyOption(fileData?.privacyType || "public");
    } finally {
      setIsChangingPrivacyType(false);
    }
  };

  const handleSendViaEmail = async () => {
    setSendingEmail(true);
    try {
      const payload = {
        sharedURL: uniqueURL,
        email: userEmail,
      };
      const res = await sendViaEmail(payload);
      setUserEmail("");
      toast.success("Email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <Dialog open={openFileDetailsModal} onOpenChange={setOpenFileDetailsModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shared File</DialogTitle>
          <DialogDescription>
            Anyone with the link can access and download this file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Share Link Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Share Link
            </label>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={shareLink}
                className="flex-1 bg-muted/50 text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="px-3 cursor-pointer"
                onClick={handleCopy}
              >
                <span className="sr-only">Copy</span>
                {hasCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {editedPrivacyOption === "private" && !isChangingPrivacyType && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  OTP
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={newGeneratedOTP?.toString() || ""}
                    className="flex-1 bg-muted/50 text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="px-3 cursor-pointer"
                    onClick={handleCopyOTP}
                  >
                    <span className="sr-only">Copy</span>
                    {hasCopiedOTP ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <hr />

          {/* Privacy Section  */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Edit Access
            </label>
            <div className="flex items-center w-full">
              <Select
                defaultValue={
                  fileData?.privacyType === "private" ? "private" : "public"
                }
                value={editedPrivacyOption}
                onValueChange={(value) => {
                  setEditedPrivacyOption(value);
                  handlePrivacyOptionEdit(value);
                }}
                disabled={isChangingPrivacyType}
              >
                <SelectTrigger className="w-full relative">
                  {isChangingPrivacyType ? (
                    <div className="flex justify-center items-center gap-2">
                      <SpinnerCustom />
                    </div>
                  ) : (
                    <SelectValue placeholder="Select a privacy option" />
                  )}
                </SelectTrigger>

                <SelectContent className="w-full">
                  <SelectGroup>
                    <SelectLabel>Privacy Options</SelectLabel>
                    <SelectItem value="public">
                      <UserRound /> Public
                    </SelectItem>
                    <SelectItem value="private">
                      <Lock /> Private
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email Section */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium leading-none">
                Send via Email
              </label>
              <p className="text-[13px] text-muted-foreground">
                Note: Sending via email breaks end-to-end encryption.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex-1 focus-visible:ring-1"
              />
              <Button
                disabled={!isValidEmail(userEmail) || isSendingEmail}
                onClick={handleSendViaEmail}
                className="active:scale-97 cursor-pointer rounded-full"
              >
                {isSendingEmail ? <SpinnerCustom /> : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFileDetailsModal;
