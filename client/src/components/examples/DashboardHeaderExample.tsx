import DashboardHeader from '../DashboardHeader';

export default function DashboardHeaderExample() {
  return (
    <DashboardHeader 
      webhookStatus="online"
      lastActivity={new Date()}
      totalWebhooks={127}
      onSettingsClick={() => console.log('Settings clicked')}
    />
  );
}