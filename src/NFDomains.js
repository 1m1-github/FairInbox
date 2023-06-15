import { NFD_URL } from "./global"

export async function from_nickname_to_address(nickname) {
    const response = await fetch(`${NFD_URL}/${nickname}?view=tiny`)
    const data = await response.json()
    console.log("from_nickname_to_address", data)
    return data["depositAccount"]
}