import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-blood text-silver hover:bg-blood/80 border-blood",
  ghost: "bg-transparent text-silver hover:bg-silver/10 border-steel/40",
  gold: "bg-gold text-ink hover:bg-gold/85 border-gold",
  ink: "bg-transparent text-ink hover:bg-ink/10 border-ink/40", // for parchment backgrounds
};

/** The one button style of the site. Renders a <Link> when `to` is given. */
export default function Button({ to, variant = "primary", className = "", children, ...rest }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md border px-5 py-2.5 font-display text-sm font-semibold tracking-wider transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
