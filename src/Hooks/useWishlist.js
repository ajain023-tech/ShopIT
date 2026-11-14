import { useCallback, useContext, useMemo, useState } from "react";
import { ContextFunction } from "../Context/Context";
import {
    addWishlistItem,
    fetchWishlist,
    getWishlistProductId,
    removeWishlistItem
} from "../Services/WishlistService";

const getErrorMessage = (error, fallback) => error?.response?.data?.msg || error?.message || fallback;

const useWishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const authToken = localStorage.getItem("Authorization");
    const isAuthenticated = Boolean(authToken);

    const wishlistProductIds = useMemo(
        () => new Set(wishlistData.map(getWishlistProductId).filter(Boolean)),
        [wishlistData]
    );

    const getWishlistItemByProductId = useCallback(
        (productId) => wishlistData.find((item) => getWishlistProductId(item) === productId),
        [wishlistData]
    );

    const isInWishlist = useCallback(
        (productId) => wishlistProductIds.has(productId),
        [wishlistProductIds]
    );

    const refreshWishlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWishlistData([]);
            return [];
        }

        setWishlistLoading(true);
        try {
            const data = await fetchWishlist(authToken);
            setWishlistData(data);
            return data;
        } finally {
            setWishlistLoading(false);
        }
    }, [authToken, isAuthenticated, setWishlistData]);

    const addToWishlist = useCallback(async (product) => {
        if (!isAuthenticated) {
            return { requiresAuth: true };
        }

        if (!product?._id) {
            throw new Error("Invalid product selected");
        }

        if (isInWishlist(product._id)) {
            return { duplicate: true };
        }

        setWishlistLoading(true);
        try {
            const data = await addWishlistItem(product._id, authToken);
            if (data.length > 0) {
                setWishlistData(data);
            } else {
                await refreshWishlist();
            }
            return { success: true };
        } catch (error) {
            throw new Error(getErrorMessage(error, "Unable to add product to wishlist"));
        } finally {
            setWishlistLoading(false);
        }
    }, [authToken, isAuthenticated, isInWishlist, refreshWishlist, setWishlistData]);

    const removeFromWishlist = useCallback(async (wishlistItem) => {
        if (!isAuthenticated) {
            return { requiresAuth: true };
        }

        const wishlistItemId = wishlistItem?._id;
        const productId = getWishlistProductId(wishlistItem);

        if (!wishlistItemId) {
            throw new Error("Invalid wishlist item selected");
        }

        setWishlistLoading(true);
        try {
            await removeWishlistItem(wishlistItemId, authToken);
            setWishlistData((current) => current.filter((item) => getWishlistProductId(item) !== productId));
            return { success: true };
        } catch (error) {
            throw new Error(getErrorMessage(error, "Unable to remove product from wishlist"));
        } finally {
            setWishlistLoading(false);
        }
    }, [authToken, isAuthenticated, setWishlistData]);

    return {
        authToken,
        isAuthenticated,
        wishlistData,
        wishlistLoading,
        refreshWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistItemByProductId
    };
};

export default useWishlist;
