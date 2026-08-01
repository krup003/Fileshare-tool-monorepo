"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { History, MessageSquare, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { FeedbackModal } from "@/components/FeedbackModal";
import GithubLogo from "@/public/svgs/GithubLogo";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();
  const [hideButton, setHideButton] = useState(false);
  const [gitStars, setGitStars] = useState(0);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }
    const section = document.getElementById("shared-list-content");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideButton(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [pathname]);

  const handleScrollToSection = () => {
    const section = document.getElementById("shared-list-content");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch("https://api.github.com/repos/krup003/Fileshare-tool-monorepo")
      .then((res) => res.json())
      .then((data) => setGitStars(data.stargazers_count));
  }, []);

  return (
    <header className="border-b border-border bg-background/70 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <h1 className="text-xl font-semibold tracking-tight">
          <span className="text-foreground text-2xl font-bold">File</span>
          <span className="text-muted-foreground">Transfer</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          {pathname === "/" && !hideButton && (
            <Button
              variant="secondary"
              onClick={handleScrollToSection}
              className="flex items-center gap-2 text-sm transition h-9 w-9 sm:w-auto sm:px-4 p-0 sm:p-2 cursor-pointer"
            >
              <History className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Share History</span>
            </Button>
          )}
          <FeedbackModal>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm transition h-9 w-9 sm:w-auto sm:px-4 p-0 sm:p-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Feedback</span>
            </Button>
          </FeedbackModal>
          <Button variant="outline" asChild>
            <Link
              href="https://github.com/krup003/Fileshare-tool-monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <GithubLogo className="h-4 w-4 shrink-0" />

              <div className="flex items-center gap-1 rounded-md px-2 py-0.5 text-sm">
                <Star className="h-4 w-4 text-[#f5c542]" fill="#f5c542" />
                <span>{gitStars}</span>
              </div>
            </Link>
          </Button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
