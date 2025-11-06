import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getData from "../../utils/getData";

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getData(
                `${import.meta.env.VITE_API_URL}auth/user`
            );
            return {
                ...response.data.userinfo,
                roles: response.data.user?.roles || [],
                groups: response.data.user?.groups || [],
                permissions: response.data.permissions || {},
            };
        } catch (error) {
            if (error.status === 401) {
                return rejectWithValue("unauthorized");
            } else {
                return rejectWithValue(error.message || "unknown");
            }
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        loading: true,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = null;
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
