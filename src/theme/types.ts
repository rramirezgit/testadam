import type {
  Shadows,
  Direction,
  ColorSystemOptions,
  CssVarsThemeOptions,
  SupportedColorScheme,
  ThemeOptions as MuiThemeOptions,
} from '@mui/material/styles';

import type { CustomShadows } from './core/custom-shadows';

// ----------------------------------------------------------------------

/**
 * Theme options
 * Extended type that includes additional properties for color schemes and CSS variables.
 *
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-materialsrc//styles/createTheme.ts
 */

export type ThemeColorScheme = SupportedColorScheme;
export type ThemeDirection = Direction;
export type ThemeCssVariables = Pick<
  CssVarsThemeOptions,
  'colorSchemeSelector' | 'disableCssColorScheme' | 'cssVarPrefix' | 'shouldSkipGeneratingVar'
>;

type ColorSchemeOptionsExtended = ColorSystemOptions & {
  shadows?: Shadows;
  customShadows?: CustomShadows;
};

export type ThemeOptions = Omit<MuiThemeOptions, 'components'> &
  Pick<CssVarsThemeOptions, 'defaultColorScheme' | 'components'> & {
    colorSchemes?: Record<ThemeColorScheme, ColorSchemeOptionsExtended>;
    cssVariables?: ThemeCssVariables;
  };
