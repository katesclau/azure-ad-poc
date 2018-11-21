import axios from 'axios'
import dotenv from 'dotenv';
dotenv.config();

const graph = {
    endpoint: `https://graph.windows.net/${process.env.tenantID}`,
    params: {
        "api-version": 1.6
    }
}

async function getMe(user) {
    if (!user) throw "User not logged in"
    const uri = `${graph.endpoint}/me`
    const opts = getOpts(user)
    const { data } = await axios.get(uri, opts).catch((e) => { throw(e.response.data["odata.error"].code) })
    if (!data) throw "Error fetching data"
    return (({ objectId, displayName, otherMails }) => ({
        oid: objectId, 
        name: displayName, 
        email: otherMails[0]
    }))(data)
}

async function updatePassword(user, currentPassword, newPassword) {
    if (!user) throw "User not logged in"
    console.log(user.access_token)
    const opts = getOpts(user)
    opts.data = { currentPassword, newPassword }
    opts.url = `${graph.endpoint}/me/changePassword`
    opts.method = 'post'
    debugger
    const response = await axios(opts).catch((e) => { throw(e.response.data["odata.error"].code) })
    console.log(response)
    return response 
}

export default { getMe, updatePassword }

function getOpts(user) {
    return {
        headers: {
            Authorization: `Bearer ${user.access_token}`
        },
        params: {
            ...graph.params
        }
    };
}
