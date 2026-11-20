import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const file = (await req.formData()).get("image");
  if (!(file instanceof File)) return Response.json({ message: "No image selected" }, { status: 400 });

  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!data.success) return Response.json({ message: "Image upload failed" }, { status: 500 });
  return Response.json({ url: data.data.display_url });
}
