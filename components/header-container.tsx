import { getAuth } from '@/lib/auth';
import HeaderPresenter from './header-presenter';

export default async function Header() {
  const user = await getAuth();

  return <HeaderPresenter user={user} />;
}
