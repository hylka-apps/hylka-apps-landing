import { useCallback } from "react";
import { Button } from "@sanity/ui";
import { EyeOpenIcon, EyeClosedIcon } from "@sanity/icons";
import { set, type BooleanInputProps } from "sanity";

/**
 * Renders the `hidden` boolean as a single eye toggle instead of a checkbox:
 *  - open eye  → visible on site
 *  - closed eye → hidden from site
 */
export function EyeToggleInput(props: BooleanInputProps) {
  const { value, onChange } = props;
  const isHidden = value === true;
  const toggle = useCallback(
    () => onChange(set(!isHidden)),
    [isHidden, onChange]
  );
  return (
    <Button
      mode="ghost"
      tone={isHidden ? "critical" : "positive"}
      icon={isHidden ? EyeClosedIcon : EyeOpenIcon}
      text={isHidden ? "Hidden from site" : "Visible on site"}
      onClick={toggle}
      style={{ cursor: "pointer" }}
    />
  );
}
