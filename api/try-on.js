export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }
  if (!process.env.FASHN_API_KEY) {
    return res.status(503).json({ message: "Virtual try-on is not connected yet. Add FASHN_API_KEY in Vercel Project Settings → Environment Variables, then redeploy." });
  }
  try {
    const { modelImage, productImage } = req.body || {};
    const validDataImage = (value) => typeof value === "string" && /^data:image\/(jpeg|png|webp);base64,/i.test(value) && value.length < 4_000_000;
    if (!validDataImage(modelImage) || !validDataImage(productImage)) {
      return res.status(400).json({ message: "Please upload two valid images under the size limit." });
    }
    const response = await fetch("https://api.fashn.ai/v1/run", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.FASHN_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: "tryon-max",
        inputs: { model_image: modelImage, product_image: productImage, generation_mode: "fast", resolution: "1k", num_images: 1, output_format: "jpeg" }
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = response.status === 401 ? "The FASHN API key was rejected. Check the Vercel environment variable." :
        response.status === 402 ? "Your FASHN API account needs more credits." :
        "The AI service could not start this preview. Please try again.";
      return res.status(response.status === 401 ? 502 : response.status === 402 ? 402 : 502).json({ message, providerStatus: response.status });
    }
    if (!data.id) return res.status(502).json({ message: "The AI service did not return a prediction ID." });
    return res.status(200).json({ id: data.id });
  } catch (error) {
    return res.status(500).json({ message: "Unexpected error while starting the AI preview." });
  }
}
