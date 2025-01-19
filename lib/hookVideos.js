import { useEffect, useState } from 'react';




const hookVideos = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setisLoading] = useState(true);


    const fetchData = async () => {
        setisLoading(true);
        try {
            const response = await fn();
            setData = response;
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setisLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return [ data, isLoading, refetch ]
}
export default hookVideos;