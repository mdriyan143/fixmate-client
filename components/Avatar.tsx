type AvatarProps = { user: { name?: string | null; image?: string | null }; size?: number };

export default function Avatar({ user, size = 40 }: AvatarProps) {
  const box = { width: size, height: size };
  if (user.image) {
    return <img src={user.image} alt={user.name ?? ""} style={box} className="rounded-full object-cover" />;
  }
  return (
    <span
      style={{ ...box, fontSize: Math.round(size * 0.42) }}
      className="grid place-items-center rounded-full bg-[image:var(--grad-brand)] font-bold text-white"
    >
      {user.name?.[0]?.toUpperCase()}
    </span>
  );
}