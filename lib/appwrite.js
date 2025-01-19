import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';
import SignIn from '../app/(auth)/sign-in';
export const config  = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.fda.aora',
    projectId: '678a9cbe000f425f0c4e',
    databaseId: '678a9ced00299003755e',
    userCollectionId: '678a9cf30018f8674655',
    videoCollectionId: '678a9dc8003af5af1b56',
    storageId:'678a99e7002591a414f1'
}

const{
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) 
    .setPlatform(config.platform) 

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


        const newUser = await databases.createDocument(

            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountID: newAccount.$id,
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

export const signIn= async(email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}


export const getCurrentUser = async () =>{
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountID', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}


export const getAllPosts = async () =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents;
    } catch (error) {
        throw  new Error(error);
    }

}