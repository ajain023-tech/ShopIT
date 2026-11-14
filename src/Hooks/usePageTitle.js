import { useEffect } from 'react'

const DEFAULT_TITLE = 'ShopIt - Online Shopping'

// set the browser tab title, e.g. "Cart | ShopIt"
const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} | ShopIt` : DEFAULT_TITLE
    }, [title])
}

export default usePageTitle
