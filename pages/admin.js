import React, { useEffect } from 'react'

export default function Admin() {

    const [isAuthorized, setIsAuthorized] = React.useState(false)
    const isAuthorizedFromLocalStoragePass = () => {
        const passwordFromLocalStorage = localStorage.getItem('admin_password')
        if (passwordFromLocalStorage === process.env.LOCAL_STORAGE_ADMIN_PASS) {
            return true
        }
        return false
    }

    useEffect(() => {
        if(isAuthorizedFromLocalStoragePass()) setIsAuthorized(true)
    }, [])
    if (!isAuthorized) return <div>not authorized</div>
    return (
        <div>admin</div>
    )
}
