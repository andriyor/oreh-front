import React from "react";

import SignalCellular0BarIcon from "@mui/icons-material/SignalCellular0Bar";
import SignalCellular1BarIcon from "@mui/icons-material/SignalCellular1Bar";
import SignalCellular2BarIcon from "@mui/icons-material/SignalCellular2Bar";
import SignalCellular3BarIcon from "@mui/icons-material/SignalCellular3Bar";
import SignalCellular4BarIcon from "@mui/icons-material/SignalCellular4Bar";

export type Range = {
  value: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
};

export const ranges: Range[] = [
  {
    value: "none",
    label: "None",
    emoji: "✅",
    icon: <SignalCellular0BarIcon />,
  },
  {
    value: "mid",
    label: "Mid",
    emoji: "😐",
    icon: <SignalCellular1BarIcon />,
  },
  {
    value: "moderate",
    label: "Moderate",
    emoji: "😣",
    icon: <SignalCellular2BarIcon />,
  },
  {
    value: "severe",
    label: "Severe",
    emoji: "😖",
    icon: <SignalCellular3BarIcon />,
  },
  {
    value: "unbeatable",
    label: "Unbeatable",
    emoji: "💀",
    icon: <SignalCellular4BarIcon />,
  },
];

export const tagIcons = ranges.reduce<Record<string, React.ReactNode>>(
  (acc, curr) => {
    acc[curr.value] = curr.emoji;
    return acc;
  },
  {},
);
