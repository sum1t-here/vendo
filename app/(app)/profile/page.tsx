import Profile from '@/components/profile-container';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export default function ProfilePage() {
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <Profile />
    </div>
  );
}
