export function formatTransactions(sent, received) {
  const sentTransactions = sent.map((item) => ({ ...item, type: 'sent' }));
  const receivedTransactions = received.map((item) => ({
    ...item,
    type: 'received',
  }));

  return [...sentTransactions, ...receivedTransactions].sort(
    (a, b) => b.created_at.getTime() - a.created_at.getTime(),
  );
}