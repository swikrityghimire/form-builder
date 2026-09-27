import { useState, useMemo } from "react";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import type { FormSchema } from "@/types";
import { generateShareUrl } from "@/lib/share/encode";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: FormSchema;
}

export function ShareModal({ open, onOpenChange, schema }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => generateShareUrl(schema), [schema]);

  const urlLength = shareUrl.length;
  const isVeryLong = urlLength > 8000;
  const isLong = urlLength > 4000;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleOpen = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share this form
          </DialogTitle>
          <DialogDescription>
            Anyone with this link can fill out your form. Responses are stored
            in their browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL Display */}
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <LinkIcon className="h-3.5 w-3.5" />
                Shareable Link
              </span>
              <Badge
                variant={isVeryLong ? "destructive" : isLong ? "secondary" : "outline"}
                className="text-xs"
              >
                {urlLength.toLocaleString()} chars
              </Badge>
            </Label>

            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-xs"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpen}
                className="shrink-0"
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Warning for long URLs */}
          {isLong && (
            <Alert variant={isVeryLong ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {isVeryLong
                  ? "⚠️ This URL is very long. Some browsers or messaging apps may not handle URLs this long. Consider using the JSON export method instead."
                  : "This URL is fairly long. It should work in most browsers, but may cause issues in some messaging apps."}
              </AlertDescription>
            </Alert>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleCopy} className="w-full">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleOpen} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview Form
            </Button>
          </div>

          <Separator />

          {/* Info */}
          <div className="space-y-2 text-sm">
            <p className="font-medium">How it works:</p>
            <ul className="space-y-1.5 text-muted-foreground text-xs">
              <li className="flex gap-2">
                <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                Form definition is encoded in the URL (no database needed)
              </li>
              <li className="flex gap-2">
                <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                Anyone with the link can fill the form
              </li>
              <li className="flex gap-2">
                <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                Responses are stored in the visitor's browser
              </li>
              <li className="flex gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                You won't receive responses — the visitor sees them
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}