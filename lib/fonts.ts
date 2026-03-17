import { Geist, Geist_Mono, Urbanist, Inter } from "next/font/google";
import localFont from "next/font/local";

export const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const segmentA = localFont({
  src: "../public/fonts/SegmentAKeyTrial-Regular.otf",
  variable: "--font-segment-a",
  weight: "400",
  style: "normal",
});

export const TTFirsNeue = localFont({
  src: "../public/fonts/TT Firs Neue Trial Regular.ttf",
  variable: "--font-ttfirsneue",
  weight: "400",
  style: "normal",
});

export const DINEng = localFont({
  src: "../public/fonts/DINEngschriftStd.otf",
  variable: "--font-DINEng",
  weight: "400",
  style: "normal",
});

export const segmentAbold = localFont({
  src: "../public/fonts/SegmentAKeyTrial-Bold.otf",
  variable: "--font-segmentAbold",
  weight: "400",
  style: "normal",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const DSDIGI = localFont({
  src: [
    {
      path: './DS-DIGI.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dsdigi',
});
