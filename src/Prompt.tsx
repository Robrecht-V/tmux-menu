import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

export interface PromptProps {
  label: string;
  /** Resolve with the entered text, or null if the user cancelled (Esc). */
  onSubmit: (value: string | null) => void;
}

// A tiny single-line text input — enough for the new/rename name prompts
// without pulling in another dependency.
export function Prompt({ label, onSubmit }: PromptProps): React.ReactElement {
  const [value, setValue] = useState('');

  useInput((input, key) => {
    if (key.return) {
      onSubmit(value);
    } else if (key.escape) {
      onSubmit(null);
    } else if (key.backspace || key.delete) {
      setValue((v) => v.slice(0, -1));
    } else if (input && !key.ctrl && !key.meta) {
      setValue((v) => v + input);
    }
  });

  return (
    <Box>
      <Text>{label}: </Text>
      <Text>{value}</Text>
    </Box>
  );
}
