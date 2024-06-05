/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {
  src: string;
};

export default function ImageCard({ src }: Props) {
  return <img className="w-full rounded-lg h-auto" src={src} alt="" />;
}
