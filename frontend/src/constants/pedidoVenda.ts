export const STATUS_PEDIDO_MAP = {
  ABERTO: 'O',
  FECHADO: 'C',
} as const;

export const STATUS_PEDIDO_OPTIONS = [
  { label: "Aberto", value: STATUS_PEDIDO_MAP.ABERTO },
  { label: "Fechado", value: STATUS_PEDIDO_MAP.FECHADO },
];