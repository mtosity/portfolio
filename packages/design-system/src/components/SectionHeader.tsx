import React from "react";

interface Props {
  title: string;
  /** One line under the heading that says what the section holds. */
  lede?: React.ReactNode;
  /** Right-aligned companion: a count, a link, a control. */
  aside?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
  /** @deprecated v0 section numbers; ignored. */
  num?: string;
}

/* A section opens with a heading that names it, set in the display
   voice. No numbers, no eyebrow label, no rule. */
export const SectionHeader = ({ title, lede, aside, id, as: Tag = "h2" }: Props) => (
  <div className="section-header">
    <div>
      <Tag id={id} className="section-header-title display">
        {title}
      </Tag>
      {lede ? <p className="section-header-lede">{lede}</p> : null}
    </div>
    {aside ? <div className="section-header-aside">{aside}</div> : null}
  </div>
);
