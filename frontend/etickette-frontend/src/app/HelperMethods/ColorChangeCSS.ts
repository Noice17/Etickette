// styles.ts
export const priorityPinStyles: Record<string, string> = {
  low: "bg-green-low text-white",
  medium: "bg-yellow-mid text-white",
  high: "bg-orange-high text-white",
  critical: "bg-red-critical text-white",
};

export const statusCardStyles: Record<string, string> = {
  open: "bg-blue-active text-white",
  in_progress: "bg-white text-dark-text",
  resolved: "bg-white text-dark-text",
  closed: "bg-gray-200 text-gray-700",
};

export const statusTextStyles: Record<string, string> = {
  open: "text-white",
  in_progress: "text-blue-active",
  resolved: "bg-white text-green-600",
  closed: "bg-gray-200 text-gray-700",
};

export const statusPinStyles: Record<string, string> = {
  open: "bg-white text-blue-active",
  in_progress: "bg-blue-active text-white",
  resolved: "bg-green-low text-white",
  closed: "bg-gray-300 text-gray-700",
};

export const statusClientPinStyles: Record<string, string> = {
  open: "bg-blue-active text-white",
  in_progress: "bg-white text-blue-active",
  resolved: "bg-green-low text-white",
  closed: "bg-gray-300 text-gray-700",
};

export const statusClientCardStyles: Record<string, string> = {
  open: "bg-white text-blue-active",
  in_progress: "bg-blue-active text-white",
  resolved: "bg-white text-green-800",
  closed: "bg-white text-gray-700",
};

export function getStyle(
  key: string,
  styleMap: Record<string, string>,
  defaultStyle = "bg-white text-blue-active"
) {
  return styleMap[key.toLowerCase()] || defaultStyle;
}
