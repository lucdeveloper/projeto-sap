export const formatarMoedaBR = (valor: number | string | undefined | null): string => {
  if (valor === undefined || valor === null) return "R$ 0,00";

  const numero = typeof valor === "string" ? parseFloat(valor) : valor;

  if (isNaN(numero)) return "R$ 0,00";

  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
};