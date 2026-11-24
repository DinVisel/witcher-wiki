/** Site footer with the content licence credit and fan-project disclaimer. */
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-steel/20 py-8 text-center text-xs text-steel">
      <div className="mx-auto max-w-7xl space-y-2 px-4">
        <p>
          Content from the{" "}
          <a
            href="https://witcher.fandom.com/"
            target="_blank"
            rel="noreferrer"
            className="text-gold underline-offset-2 hover:underline"
          >
            Witcher Wiki (Fandom)
          </a>
          , licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
            rel="noreferrer"
            className="text-gold underline-offset-2 hover:underline"
          >
            CC BY-SA
          </a>
          .
        </p>
        <p>Fan project made for a course midterm. Not affiliated with CD PROJEKT RED or Netflix.</p>
      </div>
    </footer>
  );
}
