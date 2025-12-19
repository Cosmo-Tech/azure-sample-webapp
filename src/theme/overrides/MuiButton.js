// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { getCosmoButtonVariants } from './utils/cosmoButton.variants';

export default function MuiButton(theme) {
  const variants = getCosmoButtonVariants(theme.palette);

  return {
    styleOverrides: {
      root: ({ ownerState }) => {
        const variant = ownerState.variant;
        const state = ownerState.state ?? 'enabled';
        const iconOnly = !ownerState?.children && !ownerState?.label;

        if (!variants[variant]) return {};

        const cfg = variants[variant][state];
        if (!cfg) return {};

        return {
          textTransform: 'none',
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 600,

          padding: iconOnly ? '9.5px' : '8px 8px',
          minWidth: iconOnly ? 'fit-content' : 'unset',
          width: iconOnly ? 'fit-content' : 'auto',

          borderRadius: '6px',
          background: cfg.bg,
          color: cfg.text,
          border: `1px solid ${cfg.border}`,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 36,
          gap: iconOnly ? 0 : '8px',

          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',

          '& svg': {
            width: 16,
            height: 16,
            color: cfg.icon,
            strokeWidth: 1.5,
            margin: iconOnly ? 0 : undefined,
          },

          '& .MuiButton-startIcon': {
            marginRight: '0 !important',
            marginLeft: '0 !important',
          },

          '&:hover': {
            background: cfg.bg,
            opacity: 0.9,
          },
        };
      },
    },
  };
}
