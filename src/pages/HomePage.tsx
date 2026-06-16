import HeroBanner from '../components/HeroBanner';
import StatsStrip from '../components/StatsStrip';
import TrendingStories from '../components/TrendingStories';
import IssueMap from '../components/IssueMap';
import YouthManifesto from '../components/YouthManifesto';
import ActivePetitions from '../components/ActivePetitions';
import MemeParliament from '../components/MemeParliament';
import YouthDashboard from '../components/YouthDashboard';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroBanner />
      <StatsStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendingStories />
        <IssueMap />
        <YouthManifesto />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivePetitions />
        <MemeParliament />
        <YouthDashboard />
      </div>
    </div>
  );
}
