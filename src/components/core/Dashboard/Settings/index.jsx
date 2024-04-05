import ChangeProfilePicture from "./ChangeProfilePicture";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import UpdatePassword from "./UpdatePassword";

function Settings() {
    return (
        <div className="space-y-12">
            <ChangeProfilePicture />

            <EditProfile />

            <UpdatePassword/>

            <DeleteAccount/>
        </div>
    )
}

export default Settings
