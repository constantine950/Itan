import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { EventProps } from "@/lib/types";

export default function Event({
  id,
  image_url,
  title,
  year,
  description,
}: EventProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-6"
    >
      {image_url && (
        <div className="relative w-full h-44 mb-4 rounded-xl overflow-hidden">
          <Image src={image_url} alt={title} fill className="object-cover" />
        </div>
      )}

      <span className="text-sm font-semibold text-emerald-600">{year}</span>
      <h3 className="text-xl font-bold mt-1 text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-3">{description}</p>

      <Link
        href={`/event/${id}`}
        className="mt-4 inline-block text-emerald-600 font-medium hover:underline"
      >
        Read More →
      </Link>
    </motion.div>
  );
}
