/** Texto cujas letras rolam para cima no hover do elemento pai `.group`. */
export default function Roll({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      {Array.from(children).map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          data-char={char === " " ? " " : char}
          style={{ ["--i" as string]: i }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
