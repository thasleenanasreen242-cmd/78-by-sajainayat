export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }
  if (!process.env.FASHN_API_KEY) {
    return res.status(503).json({ message: "Virtual try-on is not connected yet. Add FASHN_API_KEY in Vercel." });
  }
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!/^[a-zA-Z0-9-]{8,100}$/.test(id)) {
    return res.status(400).json({ message: "Invalid prediction ID." });
  }
  try {
    const response = await fetch("https://api.fashn.ai/v1/status/" + encodeURIComponent(id), {
      headers: { "Authorization": "Bearer " + process.env.FASHN_API_KEY }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(502).json({ message: "Could not check the AI preview status." });
    if (data.status === "failed") return res.status(200).json({ status: "failed", message: "The AI could not create this preview. Try clearer photos." });
    if (data.status === "completed" && Array.isArray(data.output) && data.output[0]) {
      const output = data.output[0];
      if (typeof output !== "string" || !/^https:\/\/(cdn|media)\.fashn\.ai\//.test(output)) {
        return res.status(502).json({ message: "The AI returned an unexpected result URL." });
      }
      return res.status(200).json({ status: "completed", output });
    }
    return res.status(200).json({ status: data.status || "processing" });
  } catch (error) {
    return res.status(500).json({ message: "Unexpected error while checking the AI preview." });
  }
}
