import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';
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
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountID', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

const checkSession = async () => {
    try {
        const sessions = await account.listSessions();
        if (sessions.total > 0) {
            return sessions.sessions[0]; // Return the first session found
        }
        return null; // No session found
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error checking session:", err.message);
        } else {
            console.error("Unexpected error:", err);
        }
        return null;
    }
};

//Funtion to delete the session: 
const deleteSession = async (sessionId) => {
    try {
        await account.deleteSession(sessionId);
        console.log("Session deleted successfully");
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error deleting session:", err.message);
        } else {
            console.error("Unexpected error:", err);
        }
    }
};

const checkAndDeleteSession = async () => {
    const session = await checkSession();
    if (session) {
        console.log("Session found:", session.$id);
        await deleteSession(session.$id);
    } else {
        console.log("No active session found");
    }
};
// signin
export const Login = async (email, password) => {
    try {
        await checkAndDeleteSession();
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error)

    }
}