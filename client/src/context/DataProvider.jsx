import { createContext, useState } from "react";


export const DataContext = createContext(null);

const getStoredAccount = () => {
    try {
        return JSON.parse(sessionStorage.getItem('account')) || { name: '', username: '' };
    } catch (error) {
        return { name: '', username: '' };
    }
};

const DataProvider = ({ children }) => {
    const [ account, setAccountState ] = useState(getStoredAccount);

    const setAccount = (value) => {
        setAccountState(value);
        if (value?.username) {
            sessionStorage.setItem('account', JSON.stringify(value));
        } else {
            sessionStorage.removeItem('account');
        }
    };

    return (
        <DataContext.Provider value={{ 
            account, 
            setAccount 
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;