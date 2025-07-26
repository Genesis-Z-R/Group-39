const BASE_URL = "http://localhost:8080/api/users"
export const createUser = async(email: string, password: string, username: string, token: string) => {
    const res = await fetch(`${BASE_URL}/firebase`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password, username})
    })
    console.log("res", res)
    return res.json()
}