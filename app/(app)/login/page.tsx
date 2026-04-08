import LoginForm from '@/components/login-form';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export default function LoginPage() {
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <LoginForm />
    </div>
  );
}
