import { Icon } from "@/components/icons/Icon";

/** QuantaScope brand mark — distinct from workflow/UI icons like `layers`. */
export function BrandMark({ size = 16 }: { size?: number }) {
  return <Icon name="scan" size={size} aria-hidden />;
}
