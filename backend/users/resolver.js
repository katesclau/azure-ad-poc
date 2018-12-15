import { createError } from 'apollo-errors';

const FooError = createError('FooError', {
    message: 'A foo error has occurred'
});

const me = async (_parent, _, { dataSources, user }) => {
    return await dataSources.azureAd.getMe(user)
}

const updatePassword = async (_parent, { input }, { dataSources, user }) => {
    const { currentPassword, newPassword } = input
    const results = await dataSources.azureAd.updatePassword(user, currentPassword, newPassword)
    console.log(results)
    return dataSources.azureAd.getMe(user)
}

export default {
    Query: {
        me
    },
    Mutation: {
        updatePassword
    }
}