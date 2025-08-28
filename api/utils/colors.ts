
// Paleta de cores do projeto extraída de variáveis CSS e classes utilitárias
export const APP_COLOR = "#dc2626"; // Cor principal do aplicativo, usada em botões e destaques
export const APP_COLOR_LIGHT = "#fca5a5"; // Cor clara do aplicativo, usada em hover e estados ativos
export const APP_COLOR_HOVER = "#b91c1c"; // Cor de hover para botões e links
export const APP_BACKGROUND = "#f9fafb"; // Cor de fundo principal do aplicativo
export const APP_FOREGROUND = "#111827"; // Cor de texto principal, usada em títulos e textos importantes
export const APP_MUTED = "#6b7280"; // Cor de texto secundário, usada em descrições e textos menos importantes
export const APP_BORDER = "#e5e7eb"; // Cor de borda, usada em contornos de cartões e inputs
export const APP_ACCENT = "#f59e0b"; // Cor de destaque, usada em botões de ação secundária
export const APP_ACCENT_FOREGROUND = "#1f2937"; // Cor de texto para elementos de destaque
export const APP_DESTRUCTIVE = "#dc2626"; // Cor para ações destrutivas, como excluir ou remover
export const APP_DESTRUCTIVE_FOREGROUND = "#ffffff"; // Cor de texto para ações destrutivas
export const APP_PRIMARY = "#2563eb"; // Cor primária, usada em botões principais e links importantes
export const APP_PRIMARY_FOREGROUND = "#ffffff"; // Cor de texto para elementos primários
export const APP_SECONDARY = "#4b5563"; // Cor secundária, usada em botões e links secundários
export const APP_SECONDARY_FOREGROUND = "#f3f4f6"; // Cor de texto para elementos secundários
export const APP_INPUT = "#f3f4f6"; // Cor de fundo para inputs e campos de formulário
export const APP_RING = "#2563eb"; // Cor de foco para inputs e botões
export const APP_SIDEBAR_BACKGROUND = "#ffffff"; // Cor de fundo da barra lateral
export const APP_SIDEBAR_FOREGROUND = "#111827"; // Cor de texto da barra lateral
export const APP_SIDEBAR_PRIMARY = "#2563eb"; // Cor primária da barra lateral
export const APP_SIDEBAR_PRIMARY_FOREGROUND = "#ffffff"; // Cor de texto primária da barra lateral
export const APP_SIDEBAR_ACCENT = "#f59e0b"; // Cor de destaque da barra lateral
export const APP_SIDEBAR_ACCENT_FOREGROUND = "#1f2937"; // Cor de texto de destaque da barra lateral
export const APP_SIDEBAR_BORDER = "#e5e7eb"; // Cor de borda da barra lateral
export const APP_SIDEBAR_RING = "#2563eb"; // Cor de foco da barra lateral
export const APP_TSDM_RED = "#dc2626"; // Cor específica do TSDM, usada em logotipos e branding
export const APP_TSDM_RED_LIGHT = "#fca5a5"; // Versão clara da cor TSDM, usada em hover e estados ativos
export const APP_TSDM_RED_HOVER = "#b91c1c"; // Cor de hover para elementos TSDM
export const APP_TSDM_RED_HSL = "hsl(0, 100%, 43%)"; // Representação HSL da cor TSDM
export const APP_TSDM_RED_LIGHT_HSL = "hsl(0, 100%, 90%)"; // Representação HSL da cor TSDM clara
export const APP_TSDM_RED_HOVER_HSL = "hsl(0, 100%, 73%)"; // Representação HSL da cor TSDM de hover
export const APP_GRAY_CCC = "#ccc"; // Cor cinza claro, usada em gráficos e outlines
export const APP_BLACK_10 = "rgba(0,0,0,0.1)"; // Cor preta com 10% de opacidade, usada em sombras sutis
export const APP_BLACK_04 = "rgba(0,0,0,0.04)"; // Cor preta com 4% de opacidade, usada em fundos e overlays sutis
export const APP_NO_COVER = "/public/images/no_cover.png"; // Imagem padrão para capas não disponíveis
// Exportando as cores como um objeto para fácil importação
export const colors = {
  appColor: APP_COLOR,
  appColorLight: APP_COLOR_LIGHT,
  appColorHover: APP_COLOR_HOVER,
  appBackground: APP_BACKGROUND,  
  appForeground: APP_FOREGROUND,
  appMuted: APP_MUTED,
  appBorder: APP_BORDER,
  appAccent: APP_ACCENT,
  appAccentForeground: APP_ACCENT_FOREGROUND,
  appDestructive: APP_DESTRUCTIVE,
  appDestructiveForeground: APP_DESTRUCTIVE_FOREGROUND,
  appPrimary: APP_PRIMARY,
  appPrimaryForeground: APP_PRIMARY_FOREGROUND,
  appSecondary: APP_SECONDARY,
  appSecondaryForeground: APP_SECONDARY_FOREGROUND,
  appInput: APP_INPUT,
  appRing: APP_RING,
  appSidebarBackground: APP_SIDEBAR_BACKGROUND,
  appSidebarForeground: APP_SIDEBAR_FOREGROUND,
  appSidebarPrimary: APP_SIDEBAR_PRIMARY,
  appSidebarPrimaryForeground: APP_SIDEBAR_PRIMARY_FOREGROUND,
  appSidebarAccent: APP_SIDEBAR_ACCENT,
  appSidebarAccentForeground: APP_SIDEBAR_ACCENT_FOREGROUND,
  appSidebarBorder: APP_SIDEBAR_BORDER,
  appSidebarRing: APP_SIDEBAR_RING,
  appTSDMRed: APP_TSDM_RED,
  appTSDMRedLight: APP_TSDM_RED_LIGHT,
  appTSDMRedHover: APP_TSDM_RED_HOVER,
  appTSDMRedHSL: APP_TSDM_RED_HSL,
  appTSDMRedLightHSL: APP_TSDM_RED_LIGHT_HSL,
  appTSDMRedHoverHSL: APP_TSDM_RED_HOVER_HSL,
  appGrayCCC: APP_GRAY_CCC,
  appBlack10: APP_BLACK_10,
  appBlack04: APP_BLACK_04,
  appNoCover: APP_NO_COVER,
}
export default colors;
export type Colors = typeof colors;