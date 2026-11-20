// sends the file to our own /api/upload route, which talks to ImgBB with the secret key
export async function uploadImage(file: File): Promise<string> {
  // Vercel rejects request bodies over about 4.5 MB, so stop big photos early
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 4 * 1024 * 1024) throw new Error("Image must be smaller than 4 MB");

  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url as string;
}
