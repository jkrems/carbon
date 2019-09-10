import React from 'react';

const Context = React.createContext(null);

export default function ContextProvider({children, value}) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
}