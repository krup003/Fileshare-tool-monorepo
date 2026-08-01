import React from "react";
import DownloadPageClient from "./components/ShareLink";

// Mock data for the UI presentation

const DownloadPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <DownloadPageClient id={id} />
    </>
  );
};

export default DownloadPage;
