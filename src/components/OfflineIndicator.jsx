import { useSync } from "../hooks/useSync";

export default function OfflineIndicator() {
  const { isOnline } = useSync();

  if (isOnline) return null;

  return (
    <div style={{ color: "red" }}>
      You are offline. Changes will sync later.
    </div>
  );
}
