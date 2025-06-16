// src/redux/slices/authSlice.ts
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { guestService, IGuest } from '../../services/guestService';

interface AuthState {
  error: string | null;
  me: IGuest | null;
  users?: IGuest[]; // Додано для зберігання всіх користувачів
  logoutTrigger?: boolean;
  confirmTrigger?: boolean;
  language?: string;
}

const initialState: AuthState = {
  error: null,
  me: null,
  logoutTrigger: false,
  language: "ua",
  confirmTrigger: false,
  users: [], // Ініціалізуємо як порожній масив
}

const login = createAsyncThunk<IGuest, { firstName: string; lastName: string }, { rejectValue: string }>(
  "authSlice/login",
  async ({ firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await authService.login(firstName, lastName);

      if (!response.data || Object.keys(response.data).length === 0) {
        return rejectWithValue("Користувача не знайдено");
      }

      return response.data;
    } catch (e: any) {
      return rejectWithValue("Сталася помилка при вході: " + e.message);
    }
  }
);


const confirm = createAsyncThunk<IGuest, string>(
  "authSlice/confirm",
  async (id, { rejectWithValue }) => {
    try {
      const response = await guestService.confirm(id);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const getAllUsers = createAsyncThunk<
  IGuest[],                      // тип повернення — масив гостей
  void,                          // аргумент — нічого не передається
  { rejectValue: string }        // тип помилки
>(
  "authSlice/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await guestService.getAllUsers();

      if (!Array.isArray(response.data) || response.data.length === 0) {
        return rejectWithValue("Користувачів не знайдено");
      }

      return response.data;
    } catch (e: any) {
      return rejectWithValue("Сталася помилка при отриманні користувачів: " + e.message);
    }
  }
);



export const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.me = null;
    },
    setLogoutTrigger: (state) => {
      state.me = null;
      state.logoutTrigger = !state.logoutTrigger; // Перемикаємо стан logoutTrigger
    },
    setLanguage: (state, action) => {
      state.language = action.payload; // Зберігаємо вибрану мову
      localStorage.setItem("language", action.payload); // Зберігаємо мову в localStorage
    },
  setConfirmTrigger: (state) => {
      state.confirmTrigger = !state.confirmTrigger; // Перемикаємо стан confirmTrigger
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.me = action.payload;
        // Збереження first_name і last_name у localStorage
        if (action.payload.first_name && action.payload.last_name) {
          localStorage.setItem('first_name', action.payload.first_name);
          localStorage.setItem('last_name', action.payload.last_name);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.me = null;
        state.error = action.payload as string;
      })
      .addCase(confirm.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      
      .addMatcher(isRejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addMatcher(isFulfilled, (state) => {
        state.error = null;
      });
  },
});

const { actions, reducer: authReducer } = AuthSlice;

const authActions = {
  ...actions,
  login,
  confirm,
  getAllUsers
};

export { authActions, authReducer };
