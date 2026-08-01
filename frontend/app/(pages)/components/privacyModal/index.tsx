import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { Clipboard, CircleCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { SpinnerCustom } from "@/components/ui/spinner";

interface PrivacyModalProps {
  uniqueURL: string | null;
  rendomOTP: string;
  selectedPrivacyOption: string;
  setSelectedPrivacyOption: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  isOpenPrivacyModal: boolean;
  setIsOpenPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivacyModal = ({
  isOpenPrivacyModal,
  setIsOpenPrivacyModal,
  setSelectedPrivacyOption,
  selectedPrivacyOption,
  uniqueURL,
  rendomOTP,
  handleSubmit,
  isLoading,
}: PrivacyModalProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleSelectPrivacyOption = (value: string) => {
    setSelectedPrivacyOption(value);
  };

  const handleCopyToClipboard = () => {
    if (uniqueURL) {
      const fullURL = `${window.location.origin}/shared-file/${uniqueURL}`;
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      navigator.clipboard.writeText(fullURL);
      setInterval(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div>
      <Dialog open={isOpenPrivacyModal} onOpenChange={setIsOpenPrivacyModal}>
        <DialogContent className="overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              <div className="font-bold text-xl">Set Privacy Settings</div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full min-w-0">
            <RadioGroup
              value={selectedPrivacyOption}
              onValueChange={handleSelectPrivacyOption}
              className="flex justify-center gap-6 items-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="public"
                  id="public"
                  className="cursor-pointer"
                />
                <Label htmlFor="public">Public URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="private"
                  id="private"
                  className="cursor-pointer"
                />
                <Label htmlFor="private">Private URL</Label>
              </div>
            </RadioGroup>

            <div className="border rounded-lg flex items-center w-full min-w-0 overflow-hidden">
              <div
                className="cursor-pointer p-3 truncate flex-1 min-w-0 text-sm text-muted-foreground"
                onClick={handleCopyToClipboard}
              >
                {window.location.origin}/shared-file/{uniqueURL}
              </div>

              <div className="h-8 w-px bg-border shrink-0" />

              <div
                className="p-3 shrink-0 flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={handleCopyToClipboard}
              >
                {isCopied ? (
                  <CircleCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </div>
            </div>

            {selectedPrivacyOption !== "public" && (
              <div className="flex flex-col items-start gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Verification Code for Receiver
                </div>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                  {rendomOTP?.split("").map((digit, index) => (
                    <div
                      key={index}
                      className="w-8 h-9 sm:w-10 sm:h-12 flex items-center justify-center border rounded-lg text-base sm:text-lg font-semibold bg-background shadow-sm"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
              Publish {isLoading && <SpinnerCustom />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivacyModal;
