import axios from "axios";

const authConfig = (authToken) => ({
    headers: {
        Authorization: authToken
    }
});

const normalizeWishlist = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.wishlist)) {
        return data.wishlist;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};

export const fetchWishlist = async (authToken) => {
    const { data } = await axios.get(process.env.REACT_APP_GET_WISHLIST, authConfig(authToken));
    return normalizeWishlist(data);
};

export const addWishlistItem = async (productId, authToken) => {
    const { data } = await axios.post(process.env.REACT_APP_ADD_WISHLIST, { _id: productId }, authConfig(authToken));
    return normalizeWishlist(data);
};

export const removeWishlistItem = async (wishlistItemId, authToken) => {
    const { data } = await axios.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${wishlistItemId}`, authConfig(authToken));
    return data;
};

export const getWishlistProductId = (item) => item?.productId?._id || item?._id || item?.productId;
