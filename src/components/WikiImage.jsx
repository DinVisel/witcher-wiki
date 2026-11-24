import { useState } from "react";
import Medallion from "./Medallion";

/**
 * Image from the wiki with a themed placeholder when it is missing or fails.
 * `no-referrer` avoids Fandom's hotlink checks.
 */
export default function WikiImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`grid place-items-center bg-ink/60 ${className}`} aria-hidden="true">
        <Medallion className="size-16 opacity-40" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
