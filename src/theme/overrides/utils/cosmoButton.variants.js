// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const getCosmoButtonVariants = (palette) => {
  const COLOR = {
    white: palette.navigation.background,
    yellow: palette.secondary.main,
    grey01: palette.navigation.text,
    grey02: palette.primary.main,
    grey03: palette.navigation.grey03,
    grey04: palette.navigation.grey04,
    grey05: palette.navigation.border,
    grey06: palette.navigation.background,
  };

  const BASE_STATES = {
    disabled: {
      bg: COLOR.grey06,
      text: COLOR.grey05,
      icon: COLOR.grey05,
      border: COLOR.grey05,
    },
    active: {
      bg: COLOR.grey01,
      text: COLOR.white,
      icon: COLOR.white,
      border: COLOR.grey01,
    },
  };

  return {
    default: {
      enabled: {
        bg: COLOR.white,
        text: COLOR.grey01,
        icon: COLOR.grey01,
        border: COLOR.grey05,
      },
      ...BASE_STATES,
    },

    highlighted: {
      enabled: {
        bg: COLOR.yellow,
        text: COLOR.grey01,
        icon: COLOR.grey01,
        border: COLOR.white,
      },
      ...BASE_STATES,
    },

    copilot: {
      enabled: {
        bg: COLOR.grey02,
        text: COLOR.white,
        icon: COLOR.white,
        border: COLOR.grey02,
      },
      ...BASE_STATES,
    },

    outlined: {
      enabled: {
        bg: 'transparent',
        text: COLOR.grey01,
        icon: COLOR.grey01,
        border: COLOR.grey02,
      },
      disabled: {
        bg: 'transparent',
        text: COLOR.grey05,
        icon: COLOR.grey05,
        border: COLOR.grey05,
      },
      active: BASE_STATES.active,
    },

    filter: {
      enabled: {
        bg: COLOR.grey05,
        text: COLOR.grey01,
        icon: COLOR.grey01,
        border: COLOR.grey05,
      },
      ...BASE_STATES,
    },

    inpage: {
      enabled: {
        bg: 'transparent',
        text: COLOR.grey01,
        icon: COLOR.grey01,
        border: 'transparent',
      },
      disabled: {
        bg: 'transparent',
        text: COLOR.grey05,
        icon: COLOR.grey05,
        border: 'transparent',
      },
      active: BASE_STATES.active,
    },
  };
};
