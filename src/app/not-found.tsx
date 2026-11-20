import Link from "next/link";
import { Arrow } from "@/components/icons";
export default function NotFound() {
  return <section className="not-found shell" data-entrance><p className="eyebrow">404 / A loose connection</p><h1>This thread<br /><em>ends here.</em></h1><p>The page may have moved, or it hasn’t been written yet.</p><Link href="/" className="button button-primary">Back to the beginning <Arrow /></Link></section>;
}
