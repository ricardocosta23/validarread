import StatusCards from '../StatusCards';

export default function StatusCardsExample() {
  const mockMetrics = {
    totalWebhooks: 127,
    successfulWebhooks: 114,
    failedWebhooks: 13,
    processingTime: 245
  };

  return <StatusCards metrics={mockMetrics} />;
}