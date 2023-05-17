//sets password in local storage


import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function SetPassword() {
    const router = useRouter()
    useEffect(() => {
        const { password } = router.query
        // if (!password) return
        if (password === process.env.LOCAL_STORAGE_ADMIN_PASS) {
            localStorage.setItem('admin_password', password)
            router.push('/admin')
            return
        }
        if (password === process.env.LOCAL_STORAGE_EVM_PASS) {
            localStorage.setItem('evm_password', password)
            router.push('/')
            return
        }
        if (password === process.env.LOCAL_STORAGE_PUBLIC_RESULTS_PASS) {
            localStorage.setItem('tv_password', password)
            router.push('/tv')
            return
        }
    })
    return (
        <div>Checking the link authority... wait...</div>
    )
}
