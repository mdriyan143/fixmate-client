import { auth } from "@/lib/auth";

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB (Vercel also stops bodies over about 4.5 MB)

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const file = (await req.formData()).get("image");
  if (!(file instanceof File)) return Response.json({ message: "No image selected" }, { status: 400 });

  // the browser checks this too, but only the server check cannot be skipped
  if (!file.type.startsWith("image/")) return Response.json({ message: "Please choose an image file" }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ message: "Image must be smaller than 4 MB" }, { status: 413 });
  if (!process.env.IMGBB_KEY) return Response.json({ message: "Image upload is not set up" }, { status: 500 });

  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!data.success) return Response.json({ message: "Image upload failed" }, { status: 500 });
  return Response.json({ url: data.data.display_url });
}
