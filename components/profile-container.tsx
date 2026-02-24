import { getAuth } from "@/lib/auth";
import HeaderLabel from "./header-label";
import ProfilePresenter from "./profile-presenter";

export default async function Profile() {
    const user = await getAuth();
    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
                <HeaderLabel text="Profile" />
                <div className="bg-secondary-background w-[300px] md:w-[450px] p-3 flex flex-col gap-3 rounded-md border shadow-[6px_6px_0px_#000]">
                    <p className="text-center">Please login to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <ProfilePresenter user={user} />
    );
}