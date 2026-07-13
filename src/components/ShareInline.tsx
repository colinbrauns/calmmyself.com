"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Share2, Link2 } from "lucide-react";

interface WebShareNavigator extends Omit<Navigator, "share"> {
  share?: (data?: ShareData) => Promise<void>;
}

interface ShareInlineProps {
  title?: string;
  text?: string;
}

export default function ShareInline({
  title = "CalmMyself",
  text = "A free, evidence‑informed calming toolbox.",
}: ShareInlineProps) {
  const [url, setUrl] = useState("https://calmmyself.com");
  const [canWebShare, setCanWebShare] = useState(false);

  useEffect(() => {
    const navigatorWithShare = navigator as WebShareNavigator;
    setUrl(window.location.href);
    setCanWebShare(Boolean(navigatorWithShare.share));
  }, []);

  const handleShare = useCallback(async () => {
    const shareFn = (navigator as WebShareNavigator).share;
    try {
      if (shareFn) {
        await shareFn({ title, text, url });
      } else {
        await navigator.clipboard?.writeText(url);
      }
    } catch {}
  }, [text, title, url]);

  return (
    <div className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 border border-calm-100 dark:border-gray-700 rounded-md p-2">
      <span className="text-xs">Share this practice</span>
      <Button
        onClick={handleShare}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {canWebShare ? <Share2 size={16} /> : <Link2 size={16} />} Share
      </Button>
    </div>
  );
}
