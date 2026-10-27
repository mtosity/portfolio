"use client";

import { useBlogInteraction } from "./BlogContext";
import AnchorTerm from "./AnchorTerm";

interface InteractiveAnchorProps {
  text: string;
  definitionKey: string;
}

function InteractiveAnchor({ text, definitionKey }: InteractiveAnchorProps) {
  const { activeAnchor, onInteract, onClose } = useBlogInteraction();

  // Unique per instance, so the same term used twice highlights only the
  // one the reader tapped.
  const anchorId = `${definitionKey}-${text.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <AnchorTerm
      kind="definition"
      text={text}
      active={activeAnchor === anchorId}
      onOpen={() => onInteract(definitionKey, anchorId)}
      onClose={onClose}
    />
  );
}

export default InteractiveAnchor;
