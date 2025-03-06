
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  className?: string;
}

const QRCode = ({ className }: QRCodeProps) => {
  // Get the current URL without the path
  const baseUrl = window.location.origin;
  const mobileUrl = `${baseUrl}/mobile`;

  return (
    <Card className={cn("w-full max-w-[250px] overflow-hidden", className)}>
      <CardContent className="p-6 flex flex-col items-center">
        <h3 className="text-center font-medium mb-4">Scan for Mobile Access</h3>
        <div className="bg-white p-2 rounded-lg mb-3">
          <QRCodeSVG value={mobileUrl} size={180} />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            navigator.clipboard.writeText(mobileUrl);
            // We're using sonner toast in our app
            import("sonner").then(({ toast }) => {
              toast.success("Mobile URL copied to clipboard");
            });
          }}
        >
          Copy Mobile URL
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCode;
