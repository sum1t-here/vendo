import ForgotPasswordForm from '@/components/forgot-password-form';
import HeaderLabel from '@/components/header-label';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
      <HeaderLabel text="Forgot Password" />
      <ForgotPasswordForm />
    </div>
  );
}
