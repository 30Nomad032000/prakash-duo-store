"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
  slug: string;
}

export default function CategoryCard({ name, image, slug }: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all">
        <CardContent className="p-0">
          <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <h3 className="text-2xl font-bold mb-2 text-center">{name}</h3>
              <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now &rarr;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
