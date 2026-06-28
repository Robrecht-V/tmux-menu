import React, { useEffect, useState } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { MenuItem } from './sessions';

export const HEADER_HINT =
  'enter: attach   ctrl-r: rename   ctrl-x: kill   esc: quit';

export interface MenuProps {
  items: MenuItem[];
  onSelect: (token: string) => void;
  onRename?: (name: string) => void;
  onKill?: (name: string) => void;
  /** Preview text for the highlighted item (e.g. tmux list-windows output). */
  previewFor?: (item: MenuItem) => string;
}

export function Menu({
  items,
  onSelect,
  onRename,
  onKill,
  previewFor,
}: MenuProps): React.ReactElement {
  const [selected, setSelected] = useState(0);
  const current = items[selected];

  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState({
    columns: stdout?.columns ?? 80,
    rows: stdout?.rows ?? 24,
  });

  useEffect(() => {
    if (!stdout) return;
    const handleResize = () => {
      setDimensions({
        columns: stdout.columns,
        rows: stdout.rows,
      });
    };
    stdout.on('resize', handleResize);
    return () => {
      stdout.off('resize', handleResize);
    };
  }, [stdout]);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelected((i) => (i > 0 ? i - 1 : i));
    } else if (key.downArrow) {
      setSelected((i) => (i < items.length - 1 ? i + 1 : i));
    } else if (key.return) {
      onSelect(current.token);
    } else if (key.escape) {
      onSelect('__quit__');
    } else if (key.ctrl && input === 'r') {
      if (current.kind === 'session' && current.session) {
        onRename?.(current.session.name);
      }
    } else if (key.ctrl && input === 'x') {
      if (current.kind === 'session' && current.session) {
        onKill?.(current.session.name);
      }
    }
  });

  const preview = previewFor ? previewFor(current) : '(new / no preview)';

  return (
    <Box
      width={dimensions.columns}
      height={dimensions.rows}
      flexDirection="column"
    >
      <Text color="cyan">{HEADER_HINT}</Text>
      <Box marginTop={1}>
        <Box flexDirection="column" marginRight={2}>
          {items.map((item, i) => (
            <Text key={item.token} inverse={i === selected}>
              {(i === selected ? '❯ ' : '  ') + item.label}
            </Text>
          ))}
        </Box>
        <Box flexDirection="column" borderStyle="round" paddingX={1}>
          {preview.split('\n').map((line, i) => (
            <Text key={i} dimColor>
              {line}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
