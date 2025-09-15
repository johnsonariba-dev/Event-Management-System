import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

function TicketScan() {
  const [result, setResult] = useState<string | null>(null);

  const handleScan = async (text: string) => {
    setResult(text);
    try {
      const res = await fetch("http://127.0.0.1:8000/validate_ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: text }),
      });
      const data = await res.json();
      alert(data.valid ? "✅ Ticket valid!" : "❌ Ticket invalid!");
    } catch (err) {
      console.error("Validation error:", err);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-bold mb-4">Scan Ticket</h1>
      <Scanner
        onScan={(detected) => {
          if (detected && detected.length > 0) {
            handleScan(detected[0].rawValue);
          }
        }}
      />
      {result && <p className="mt-4">Scanned: {result}</p>}
    </div>
  );
}

export default TicketScan;