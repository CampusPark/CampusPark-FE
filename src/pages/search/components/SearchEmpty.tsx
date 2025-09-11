export default function SearchEmpty({
  message,
  navHeight,
}: {
  message: string;
  navHeight: number;
}) {
  return (
    <div
      className="grid place-items-center px-4 text-neutral-500"
      style={{ minHeight: `calc(100dvh - ${navHeight}px)` }}
    >
      <p className="text-[13px]">{message}</p>
    </div>
  );
}
