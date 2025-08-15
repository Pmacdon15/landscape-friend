"use client";

import React from "react";

interface DateDisplayProps {
  timestamp: number;
}

export function DateDisplay({ timestamp }: DateDisplayProps) {
  const date = new Date(timestamp * 1000);
  return <>{date.toLocaleDateString()}</>;
}