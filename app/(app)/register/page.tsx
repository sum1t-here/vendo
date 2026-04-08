import RegisterForm from '@/components/register-form';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export default function RegisterPage() {
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <RegisterForm />
    </div>
  );
}
