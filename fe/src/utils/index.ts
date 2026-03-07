export function truncateString(str: string, maxLength: number, useEllipsis = true) {
  if (typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  const ellipsis = useEllipsis ? '...' : '';
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

export function truncateAddress(address: string, frontChars = 6, backChars = 4): string {
  if (!address) return '';
  if (address.length <= frontChars + backChars + 3) return address;
  return `${address.slice(0, frontChars)}...${address.slice(-backChars)}`;
}
