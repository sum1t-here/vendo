import ForgotPasswordForm from '@/components/forgot-password-form';
import HeaderLabel from '@/components/header-label';
import BreadcrumbNav from '@/components/breadcrumb-nav';

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="py-12 px-4 md:px-14 w-full">
        <BreadcrumbNav />
      </div>
      <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
        <HeaderLabel text="Forgot Password" />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
