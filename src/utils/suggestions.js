import Cookies from "js-cookie";
import { toast } from "react-toastify";

class SuggestionSettings {
    async getSuggestionSettings(profileId) {

            await fetch(`/api/Edit/GetSuggestion/${profileId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                const setting = data[0].suggestionSetting;
                if(setting === null) {
                    toast.error("You have no settings saved", {
                        position: toast.POSITION.TOP_CENTER,
                        draggable: false
                    })
                }
                Cookies.set("suggestionSettings", JSON.stringify(setting));
            })
            .catch(error => {
                toast.error(`${error}.. Sorry we messed up, if the problem persist please contact support`, {
                    position: toast.POSITION.TOP_CENTER,
                    draggable: false
                })
            })  
    }

    async setSuggestionSetting(profileId, suggestionType) {
        const data = {
            UserId: profileId,
            suggestionSetting: suggestionType
        }
        await fetch('/api/Edit/SetSuggestion', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            toast.success(`${data}`, {
                position: toast.POSITION.TOP_CENTER,
                draggable: false
            })
        })
    }
}

export default new SuggestionSettings();