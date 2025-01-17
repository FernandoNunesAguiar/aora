import { Account, Client, ID, Avatars, Databases } from 'react-native-appwrite';
import SignIn from '../app/(auth)/sign-in';
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fda.aora',
    projectId: '678a9cbe000f425f0c4e',
    databaseId: '678a9ced00299003755e',
    userCollectionId: '678a9cf30018f8674655',
    videoCollectionId: '678a9dc8003af5af1b56',
    storageId:'678a99e7002591a414f1'
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platform) 

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)


export const createUser = async (email, password, username) =>{
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        await SignIn(email, password)

        const newUser = await databases.createDocument(

            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }

            
        )
        return newUser
        
    } catch (error) {
        console.log(error);
        throw new Error(error);

    }    
}

export async function signIn(email, password){
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}
