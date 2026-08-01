import { verifyOTP } from "@/app/apis/microservices";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SpinnerCustom } from "@/components/ui/spinner";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface OTPModalProps {
  setIsOpenOTPModel: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOTPVerify: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenOTPModal: boolean;
  uniqueId: string;
  DownloadFile: (overrideOTPVerify?: boolean) => void;
}

const OTPModal = ({
  setIsOpenOTPModel,
  isOpenOTPModal,
  uniqueId,
  setIsOTPVerify,
  DownloadFile,
}: OTPModalProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    const payload = {
      otp: otp,
      uniqueId: uniqueId,
    };
    try {
      const res = await verifyOTP(payload);

      if (res && res.success === false) {
        toast.error(res.message || "Invalid OTP");
        return;
      }

      setIsOTPVerify(true);
      setIsOpenOTPModel(false);
      toast.success(res?.message || "OTP verified successfully");
      DownloadFile(true);
      setOtp("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Please try again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog onOpenChange={setIsOpenOTPModel} open={isOpenOTPModal}>
      <DialogContent showCloseButton={false} className="max-w-[340px] sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            Enter OTP
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-sm text-muted-foreground">
            Enter the 6-digit password provided by the sender or admin to view it.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-4 sm:py-6"
          onKeyDown={(e) => {
            if (e.key === "Enter" && otp.length === 6 && !isLoading) {
              handleVerify();
            }
          }}
        >
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(value) => setOtp(value)}
            autoFocus
          >
            {/* First 3 digits */}
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
              <InputOTPSlot index={1} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
              <InputOTPSlot index={2} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
            </InputOTPGroup>

            <InputOTPSeparator />

            {/* Last 3 digits */}
            <InputOTPGroup>
              <InputOTPSlot index={3} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
              <InputOTPSlot index={4} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
              <InputOTPSlot index={5} className="w-9 h-10 sm:w-12 sm:h-12 text-base sm:text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <DialogFooter className="flex w-full flex-row gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={otp.length !== 6 || isLoading}
            className="flex-1"
          >
            Verify {isLoading && <SpinnerCustom />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OTPModal;
