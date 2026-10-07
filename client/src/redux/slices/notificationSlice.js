import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";
import { extractErrorMessage } from "../../../utils/errorHandler";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  errorMessage: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/notifications");
      return response?.data?.data || { notifications: [], unreadCount: 0 };
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not load notifications."),
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update notification."),
      );
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.patch("/notifications/read-all");
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Could not update notifications."),
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload || "Could not load notifications.";
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          ({ _id }) => _id === action.payload,
        );
        if (notification && !notification.readAt) {
          notification.readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        const readAt = new Date().toISOString();
        state.notifications.forEach((notification) => {
          if (!notification.readAt) notification.readAt = readAt;
        });
        state.unreadCount = 0;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
