import React from "react";
import ImageCard from "./ImageCard";

type Props = {
  images: string[];
};

export default function ImageGrid({ images }: Props) {
  return (
    <div className="columns-4 space-y-4 p-4">
      {images.map((image) => {
        return <ImageCard src={image} key={image} />;
      })}
    </div>
  );
}
