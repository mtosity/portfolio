"use client";

import { useBlogInteraction } from "./BlogContext";
import AnchorTerm from "./AnchorTerm";

interface CodeAnchorProps {
  text: string;
  codeKey: string;
}

function CodeAnchor({ text, codeKey }: CodeAnchorProps) {
  const { activeCodeExample, onCodeExampleInteract, onClose } = useBlogInteraction();

  const anchorId = `${codeKey}-${text.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <AnchorTerm
      kind="code"
      text={text}
      active={activeCodeExample === anchorId}
      onOpen={() => onCodeExampleInteract(codeKey, anchorId)}
      onClose={onClose}
    />
  );
}

export default CodeAnchor;
